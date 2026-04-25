const SOUND_VOLUME = 0.52;

let audioContext = null;
let masterGain = null;
let noiseBuffer = null;

const hasWindow = typeof window !== "undefined";

const getAudioContext = () => {
  if (!hasWindow) {
    return null;
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextCtor();
    masterGain = audioContext.createGain();
    masterGain.gain.value = SOUND_VOLUME;
    masterGain.connect(audioContext.destination);
  }

  return audioContext;
};

const unlockAudio = () => {
  const context = getAudioContext();
  if (!context || context.state !== "suspended") {
    return;
  }

  context.resume().catch(() => {});
};

if (hasWindow) {
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio);
}

const canPlay = () => {
  const context = getAudioContext();
  return context && context.state === "running" ? context : null;
};

const getNoiseBuffer = (context) => {
  if (noiseBuffer) {
    return noiseBuffer;
  }

  const buffer = context.createBuffer(1, context.sampleRate * 0.2, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  noiseBuffer = buffer;
  return noiseBuffer;
};

const connectNode = (source, toneNode, filterNode) => {
  source.connect(filterNode);
  filterNode.connect(toneNode);
  toneNode.connect(masterGain);
};

const scheduleTone = (
  startTime,
  frequency,
  {
    duration = 0.16,
    gain = 0.05,
    type = "triangle",
    endFrequency = null,
    filterFrequency = 2200
  } = {}
) => {
  const context = canPlay();
  if (!context || !masterGain) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filterNode = context.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFrequency, 30), startTime + duration);
  }

  filterNode.type = "lowpass";
  filterNode.frequency.setValueAtTime(filterFrequency, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  connectNode(oscillator, gainNode, filterNode);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
};

const scheduleNoise = (
  startTime,
  {
    duration = 0.08,
    gain = 0.02,
    filterFrequency = 1400
  } = {}
) => {
  const context = canPlay();
  if (!context || !masterGain) {
    return;
  }

  const noise = context.createBufferSource();
  const gainNode = context.createGain();
  const filterNode = context.createBiquadFilter();

  noise.buffer = getNoiseBuffer(context);
  filterNode.type = "bandpass";
  filterNode.frequency.setValueAtTime(filterFrequency, startTime);
  filterNode.Q.setValueAtTime(0.7, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  connectNode(noise, gainNode, filterNode);

  noise.start(startTime);
  noise.stop(startTime + duration + 0.02);
};

const at = (offsetSeconds = 0) => {
  const context = canPlay();
  return context ? context.currentTime + 0.01 + offsetSeconds : null;
};

const playMove = (isCapture = false, offsetSeconds = 0) => {
  const start = at(offsetSeconds);
  if (start === null) {
    return;
  }

  if (isCapture) {
    scheduleNoise(start, { duration: 0.06, gain: 0.015, filterFrequency: 1250 });
    scheduleTone(start, 370, { duration: 0.08, gain: 0.05, type: "square", endFrequency: 245, filterFrequency: 1800 });
    scheduleTone(start + 0.05, 246, { duration: 0.12, gain: 0.032, type: "triangle", endFrequency: 196 });
    return;
  }

  scheduleTone(start, 196, { duration: 0.07, gain: 0.042, type: "triangle", endFrequency: 168, filterFrequency: 1500 });
  scheduleTone(start + 0.018, 392, { duration: 0.06, gain: 0.01, type: "sine", filterFrequency: 2100 });
};

const playMoveSequence = (moves = []) => {
  moves.forEach((move, index) => {
    const isCapture = Boolean(move?.captured || move?.san?.includes("x"));
    playMove(isCapture, index * 0.12);
  });
};

const playBetPlaced = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 330, { duration: 0.1, gain: 0.018, type: "sine", endFrequency: 392, filterFrequency: 2400 });
  scheduleTone(start + 0.06, 494, { duration: 0.14, gain: 0.025, type: "triangle", filterFrequency: 2200 });
};

const playCorrectBet = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 523, { duration: 0.1, gain: 0.03, type: "triangle" });
  scheduleTone(start + 0.08, 659, { duration: 0.14, gain: 0.032, type: "triangle" });
  scheduleTone(start + 0.15, 784, { duration: 0.18, gain: 0.028, type: "sine" });
};

const playIncorrectBet = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 392, { duration: 0.12, gain: 0.024, type: "triangle", endFrequency: 330 });
  scheduleTone(start + 0.1, 294, { duration: 0.16, gain: 0.022, type: "triangle", endFrequency: 247 });
};

const playChallengeSent = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 392, { duration: 0.1, gain: 0.022, type: "sine" });
  scheduleTone(start + 0.07, 523, { duration: 0.14, gain: 0.026, type: "triangle" });
};

const playChallengeReceived = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 523, { duration: 0.12, gain: 0.03, type: "sine" });
  scheduleTone(start + 0.11, 659, { duration: 0.12, gain: 0.032, type: "triangle" });
  scheduleTone(start + 0.24, 523, { duration: 0.18, gain: 0.028, type: "sine" });
};

const playNotice = (tone = "neutral") => {
  const start = at();
  if (start === null) {
    return;
  }

  if (tone === "danger") {
    scheduleTone(start, 330, { duration: 0.12, gain: 0.02, type: "square", endFrequency: 220, filterFrequency: 1200 });
    return;
  }

  scheduleTone(start, 294, { duration: 0.1, gain: 0.015, type: "triangle" });
  scheduleTone(start + 0.07, 370, { duration: 0.1, gain: 0.015, type: "triangle" });
};

const playGameStart = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 294, { duration: 0.1, gain: 0.022, type: "triangle" });
  scheduleTone(start + 0.08, 392, { duration: 0.12, gain: 0.026, type: "triangle" });
  scheduleTone(start + 0.17, 494, { duration: 0.16, gain: 0.03, type: "sine" });
};

const playWin = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 392, { duration: 0.12, gain: 0.03, type: "triangle" });
  scheduleTone(start + 0.09, 523, { duration: 0.14, gain: 0.032, type: "triangle" });
  scheduleTone(start + 0.19, 659, { duration: 0.18, gain: 0.035, type: "sine" });
  scheduleTone(start + 0.31, 784, { duration: 0.28, gain: 0.03, type: "sine" });
};

const playLose = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 392, { duration: 0.14, gain: 0.024, type: "triangle", endFrequency: 330 });
  scheduleTone(start + 0.12, 294, { duration: 0.18, gain: 0.022, type: "triangle", endFrequency: 247 });
  scheduleTone(start + 0.24, 220, { duration: 0.24, gain: 0.02, type: "sine", endFrequency: 174 });
};

const playDraw = () => {
  const start = at();
  if (start === null) {
    return;
  }

  scheduleTone(start, 349, { duration: 0.12, gain: 0.02, type: "triangle" });
  scheduleTone(start + 0.09, 440, { duration: 0.16, gain: 0.022, type: "triangle" });
};

export {
  playBetPlaced,
  playChallengeReceived,
  playChallengeSent,
  playCorrectBet,
  playDraw,
  playGameStart,
  playIncorrectBet,
  playLose,
  playMove,
  playMoveSequence,
  playNotice,
  playWin,
  unlockAudio
};
