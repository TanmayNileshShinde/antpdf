import confetti from 'canvas-confetti';

export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'],
  });
}
