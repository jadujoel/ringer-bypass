class Nodes {
  public readonly Silence = document.createElement("button");
  public readonly Oscillator = document.createElement("button");
  static default() {
    const nodes = new Nodes();
    document.body.appendChild(nodes.Silence);
    document.body.appendChild(nodes.Oscillator);
    return nodes
  }
}

const nodes = Nodes.default();
const context = new AudioContext({ latencyHint: "playback", sampleRate: 48_000 });

nodes.Silence.textContent = "Play Audio Element Silence";
nodes.Silence.addEventListener("click", () => {
  const source = context.createConstantSource();
  const output = context.createMediaStreamDestination();
  const audio = new Audio();
  source.connect(output);
  audio.srcObject = output.stream;
  audio.volume = 0.001;
  source.start();
  audio.play();
}, { once: true });

nodes.Oscillator.textContent = "Play Web Audio Oscillator";
nodes.Oscillator.addEventListener("click", () => {
  const oscillator = context.createOscillator();
  oscillator.connect(context.destination);
  oscillator.start();
}, { once: true });
