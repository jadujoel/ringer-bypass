
type OscillatorState = "playing" | "stopped";
class OscillatorModel {
  state: OscillatorState = "stopped";
  source: OscillatorNode = context.createOscillator();

  play() {
    this.source = context.createOscillator();
    this.source.connect(context.destination);
    this.source.start();
    this.state = "playing";
  }
  stop() {
    this.source.stop();
    this.state = "stopped";
  }
}

type SilenceState = "playing" | "stopped";
class SilenceModel {
  state: SilenceState = "stopped";
  source: ConstantSourceNode = context.createConstantSource();
  audio: HTMLAudioElement = new Audio();

  play() {
    const output = context.createMediaStreamDestination();
    this.audio = new Audio();
    this.source = context.createConstantSource();
    this.source.offset.value = 0.000;
    this.source.connect(output);
    this.audio.srcObject = output.stream;
    this.audio.volume = 0.000;
    this.source.start();
    this.audio.play();
    this.state = "playing";
  }
  stop() {
    this.source.stop();
    this.audio.pause();
    this.audio.srcObject = null;
    this.audio.remove();
    this.source.disconnect();
    this.state = "stopped";
  }
}

const views = {
  labels: {
    oscillator(s: OscillatorState): string {
      return s === "playing" ? "Stop Oscillator" : "Play Oscillator"
    },
    silence(s: SilenceState): string {
      return s === "playing" ? "Stop Silence" : "Play Silence"
    }
  }
}
const controllers = {
  mount: {
    oscillator(parent: HTMLElement) {
      const model = new OscillatorModel();
      const view = document.createElement("button");
      const render = () => {
        view.textContent = views.labels.oscillator(model.state);
      };
      view.addEventListener("click", () => {
        if (model.state === "playing") {
          model.stop();
        } else {
          model.play();
        }
        render();
      });
      render();
      parent.appendChild(view);
    },
    silence(parent: HTMLElement) {
      const model = new SilenceModel();
      const view = document.createElement("button");
      const render = () => {
        view.textContent = views.labels.silence(model.state);
      };
      view.addEventListener("click", () => {
        if (model.state === "playing") {
          model.stop();
        } else {
          model.play();
        }
        render();
      });
      render();
      parent.appendChild(view);
    },
  }
}

const context = new AudioContext({ latencyHint: "playback", sampleRate: 48_000 });
controllers.mount.oscillator(document.body);
controllers.mount.silence(document.body);
