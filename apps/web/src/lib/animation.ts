export const motionTokens = {
  duration: {
    quick: 0.24,
    base: 0.4,
    slow: 0.7,
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    expressive: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resolveMotionDuration(baseDuration: number): number {
  return prefersReducedMotion() ? 0 : baseDuration;
}
