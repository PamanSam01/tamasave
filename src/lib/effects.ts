import confetti from "canvas-confetti";

export const playPixelSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // Slide up

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Ignore audio context errors
  }
};

export const triggerConfetti = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#9bdba8", "#242424", "#d4a373"]
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#9bdba8", "#242424", "#d4a373"]
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};
