
const context = new AudioContext({ latencyHint: "playback", sampleRate: 48_000 });

type OscillatorState = "playing" | "stopped";
interface View {
  addEventListener: (event: "click", callback: () => void) => void;
  textContent: string;
}
class Oscillator {
  private constructor(
    public view: View = document.createElement("button"),
    public state: OscillatorState = "stopped",
    public source: OscillatorNode = context.createOscillator()
  ) {}

  play() {
    this.source = context.createOscillator();
    this.source.connect(context.destination);
    this.source.start();
    this.view.textContent = "Stop Oscillator";
    this.state = "playing"
  }
  stop() {
    this.source.stop();
    this.view.textContent = "Play Oscillator";
    this.state = "stopped"
  }
  static default(): Oscillator {
    const osc = new Oscillator();
    osc.view.textContent = "Play Oscillator";
    osc.view.addEventListener("click", () => {
      if (osc.state === "playing") {
        osc.stop();
        return
      } else if (osc.state === "stopped") {
        osc.play();
      }
    });
    return osc;
  }
}

type SilenceState = "playing" | "stopped" | "disposed";
class Silence {
  private constructor(
    public state: SilenceState = "stopped",
    public view: View = document.createElement("button"),
    public source: ConstantSourceNode = context.createConstantSource(),
    public audio: HTMLAudioElement = new Audio()
  ) {}
  static default(): Silence {
    const silence = new Silence();
    silence.view.textContent = "Play Silence";
    silence.view.addEventListener("click", () => {
      if (silence.state === "disposed") {
        silence.state = "stopped"
        return
      }
      if (silence.state === "playing") {
        silence.source.stop();
        silence.audio.pause();
        silence.audio.remove()
        silence.view.textContent = "Silence Disposed";
        silence.state = "disposed"
        return
      }
      const output = context.createMediaStreamDestination();
      silence.source = context.createConstantSource();
      silence.source.connect(output);
      silence.audio.srcObject = output.stream;
      silence.audio.volume = 0.001;
      silence.source.start();
      silence.audio.play();
      silence.view.textContent = "Dispose Silence";
      silence.state = "playing"
    });
    return silence
  }
}

const osc = Oscillator.default();
const silence = Silence.default();

document.body.appendChild(osc.view as HTMLElement);
document.body.appendChild(silence.view as HTMLElement);
