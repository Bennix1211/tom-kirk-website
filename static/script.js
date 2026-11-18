const poopButton = document.getElementById("poopButton");
const animateButton = document.getElementById("animateButton");
const stage = document.querySelector(".stage");
const statusText = document.getElementById("status");
const pasteBox = document.getElementById("pasteBox");
const replayLink = document.getElementById("replayLink");
const soundToggle = document.getElementById("soundToggle");
const reveal = document.getElementById("reveal");
const closeReveal = document.getElementById("closeReveal");

let soundEnabled = true;
let audioContext = null;

function playSillySound(kind = "fart") {
  if (!soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume();

  const ctx = audioContext;
  const now = ctx.currentTime;

  // Layered low wobble + filtered noise makes a comic raspberry/fart sound.
  const osc = ctx.createOscillator();
  const wobble = ctx.createOscillator();
  const wobbleDepth = ctx.createGain();
  const toneGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(105, now);
  osc.frequency.exponentialRampToValueAtTime(62, now + 0.32);
  osc.frequency.exponentialRampToValueAtTime(88, now + 0.52);
  osc.frequency.exponentialRampToValueAtTime(48, now + 0.82);

  wobble.type = "sine";
  wobble.frequency.setValueAtTime(17, now);
  wobbleDepth.gain.setValueAtTime(22, now);
  wobble.connect(wobbleDepth);
  wobbleDepth.connect(osc.frequency);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(520, now);
  filter.frequency.exponentialRampToValueAtTime(260, now + 0.8);
  toneGain.gain.setValueAtTime(0.0001, now);
  toneGain.gain.exponentialRampToValueAtTime(0.22, now + 0.035);
  toneGain.gain.setValueAtTime(0.18, now + 0.58);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.88);

  osc.connect(filter);
  filter.connect(toneGain);
  toneGain.connect(ctx.destination);
  osc.start(now);
  wobble.start(now);
  osc.stop(now + 0.9);
  wobble.stop(now + 0.9);
}
function animate(message, sound = "fart") {
  poopButton.classList.remove("animate");
  stage.classList.remove("party", "gas-release");
  void poopButton.offsetWidth;
  poopButton.classList.add("animate");
  stage.classList.add("party", "gas-release");
  statusText.textContent = message;
  playSillySound(sound);
}

function showTom() {
  animate("PFFFFT! TOM KIRK HAS ARRIVED!", "fart");
  reveal.hidden = false;
  reveal.scrollIntoView({ behavior: "smooth", block: "center" });
}

poopButton.addEventListener("click", showTom);
animateButton.addEventListener("click", showTom);
closeReveal.addEventListener("click", () => { reveal.hidden = true; });
pasteBox.addEventListener("paste", () => animate("PFFFFT! Gas release detected!", "fart"));
replayLink.addEventListener("click", (event) => {
  event.preventDefault();
  animate("PFFFFT! Replay gas release!", "fart");
});
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊 SOUND ON" : "🔇 SOUND OFF";
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  if (soundEnabled) playSillySound("fart");
});
