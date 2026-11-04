export async function triggerConfetti(options?: { particleCount?: number; spread?: number }) {
  if (typeof window !== "undefined") {
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: options?.particleCount ?? 80,
        spread: options?.spread ?? 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  }
}

