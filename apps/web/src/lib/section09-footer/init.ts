import gsap from "gsap";

export interface Section09InitOptions {
  root: HTMLElement;
  onCTAVisible?: (isVisible: boolean) => void;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function resetTransforms(
  ball: HTMLElement | null,
  dominos: HTMLElement[],
): { ball: string; dominos: string[] } {
  const saved = { ball: ball?.style.transform ?? "", dominos: dominos.map((d) => d.style.transform) };
  ball && (ball.style.transform = "");
  dominos.forEach((d) => (d.style.transform = ""));
  return saved;
}

function restoreTransforms(
  ball: HTMLElement | null,
  dominos: HTMLElement[],
  saved: { ball: string; dominos: string[] },
) {
  ball && (ball.style.transform = saved.ball);
  dominos.forEach((d, i) => (d.style.transform = saved.dominos[i] ?? ""));
}

/**
 * Measure collision: translateX (px) for ball's right edge to touch first domino's left edge.
 */
function measureBallCollision(
  ball: HTMLElement,
  firstDomino: HTMLElement,
  dominos: HTMLElement[],
): { impactX: number; reboundX: number; ballRadius: number } {
  const saved = resetTransforms(ball, dominos);
  const ballRect = ball.getBoundingClientRect();
  const dominoRect = firstDomino.getBoundingClientRect();
  restoreTransforms(ball, dominos, saved);

  const ballRight = ballRect.left + ballRect.width;
  const dominoLeft = dominoRect.left;
  const impactX = dominoLeft - ballRight;
  const ballRadius = ballRect.width / 2;
  const reboundX = Math.max(0, impactX - ballRadius * 0.6);

  return { impactX, reboundX, ballRadius };
}

interface DominoChainCollision {
  angle12: number;
  angle23: number;
}

const getDominoReach = (deg: number, width: number, height: number): number => {
  const rad = (deg * Math.PI) / 180;
  return height * Math.sin(rad) + (width * (1 + Math.cos(rad))) / 2;
};

/**
 * Solve contact angle where domino i (rotating clockwise around bottom center)
 * reaches domino i+1 left edge.
 */
function solveDominoContactAngle(
  gap: number,
  width: number,
  height: number,
  maxDeg: number = 86,
): number {
  const maxReach = getDominoReach(maxDeg, width, height);
  if (maxReach <= gap) return maxDeg;

  let lo = 0;
  let hi = maxDeg;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    const reach = getDominoReach(mid, width, height);
    if (reach >= gap) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return (lo + hi) / 2;
}

function measureDominoChainCollision(dominos: HTMLElement[]): DominoChainCollision {
  const [d1, d2, d3] = dominos;
  if (!d1 || !d2 || !d3) return { angle12: 58, angle23: 58 };

  const saved = resetTransforms(null, dominos);
  const r1 = d1.getBoundingClientRect();
  const r2 = d2.getBoundingClientRect();
  const r3 = d3.getBoundingClientRect();
  restoreTransforms(null, dominos, saved);

  const width = r1.width;
  const height = r1.height;
  const c1 = r1.left + r1.width / 2;
  const c2 = r2.left + r2.width / 2;
  const c3 = r3.left + r3.width / 2;

  const gap12 = c2 - c1;
  const gap23 = c3 - c2;

  const angle12 = solveDominoContactAngle(gap12, width, height);
  const angle23 = solveDominoContactAngle(gap23, width, height);
  return { angle12, angle23 };
}

/**
 * One-shot 2D animation:
 * - Ball rolls once and hits first domino
 * - Dominoes fall in chained cascade (1 -> 2 -> 3)
 * - CTA appears once animation completes
 */
export function initSection09Footer(options: Section09InitOptions): () => void {
  const { root, onCTAVisible } = options;
  const ball = root.querySelector<HTMLElement>("#footer-ball");
  const dominos = Array.from(root.querySelectorAll<HTMLElement>(".footer__domino"));
  const [d1, d2, d3] = dominos;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) {
    root.setAttribute("data-reduced-motion", "true");
    onCTAVisible?.(true);
    return () => {};
  }

  root.removeAttribute("data-reduced-motion");

  let ballCollision = { impactX: 48, reboundX: 40, ballRadius: 16 };
  let dominoChainCollision: DominoChainCollision = { angle12: 58, angle23: 58 };
  const updateCollisions = () => {
    if (!ball || !d1 || !d2 || !d3) return;
    const measured = measureBallCollision(ball, d1, dominos);
    if (measured.impactX > 0 && measured.impactX < 2000) {
      ballCollision = measured;
    }
    dominoChainCollision = measureDominoChainCollision(dominos);
  };

  updateCollisions();
  requestAnimationFrame(updateCollisions);

  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(updateCollisions);
  });
  const stage = root.querySelector<HTMLElement>(".footer__stage");
  if (stage) resizeObserver.observe(stage);

  let progress = 0;
  let tween: gsap.core.Tween | null = null;

  const applyProgress = (rawProgress: number) => {
    if (!ball || dominos.length < 3) return;
    const progress = clamp(rawProgress, 0, 1);

    const approachEnd = 0.52;
    const impactReboundEnd = 0.58;
    const d1End = 0.66;
    const d2End = 0.82;
    const d3End = 0.93;

    const { impactX, reboundX, ballRadius } = ballCollision;

    let ballX: number;
    if (progress <= approachEnd) {
      ballX = (progress / approachEnd) * impactX;
    } else if (progress <= impactReboundEnd) {
      const t = (progress - approachEnd) / (impactReboundEnd - approachEnd);
      ballX = impactX - t * (impactX - reboundX);
    } else {
      ballX = reboundX;
    }

    const distanceForRotation = progress <= approachEnd ? ballX : impactX;
    const ballRotDeg = (distanceForRotation / ballRadius) * (180 / Math.PI);
    ball.style.transform = `translate3d(${ballX}px, 0, 0) rotate(${ballRotDeg}deg)`;

    const d1Raw = clamp((progress - approachEnd) / (d1End - approachEnd), 0, 1);
    const d1Rotate = d1Raw * 86;

    // Domino 2 starts exactly when domino 1 reaches contact angle with domino 2.
    const d2Start =
      approachEnd + (d1End - approachEnd) * (dominoChainCollision.angle12 / 86);
    const d2Raw = clamp((progress - d2Start) / (d2End - d2Start), 0, 1);
    const d2Rotate = d2Raw * 86;

    // Domino 3 starts exactly when domino 2 reaches contact angle with domino 3.
    const d3Start = d2Start + (d2End - d2Start) * (dominoChainCollision.angle23 / 86);
    const d3Raw = clamp((progress - d3Start) / (d3End - d3Start), 0, 1);
    const d3Rotate = d3Raw * 86;

    if (d1) d1.style.transform = `rotate(${d1Rotate}deg)`;
    if (d2) d2.style.transform = `rotate(${d2Rotate}deg)`;
    if (d3) d3.style.transform = `rotate(${d3Rotate}deg)`;
  };

  applyProgress(0);
  onCTAVisible?.(false);

  let hasPlayed = false;
  const playAnimation = () => {
    if (hasPlayed) return;
    hasPlayed = true;
    tween?.kill();
    tween = gsap.to(
      { value: 0 },
      {
        value: 1,
        duration: 2.3,
        ease: "power2.inOut",
        onUpdate: function onTick() {
          progress = this.targets()[0].value as number;
          applyProgress(progress);
        },
        onComplete: () => {
          progress = 1;
          applyProgress(progress);
          onCTAVisible?.(true);
        },
      },
    );
  };

  const inView = () => {
    const rect = root.getBoundingClientRect();
    return (
      rect.top < window.innerHeight * 0.8 &&
      rect.bottom > window.innerHeight * 0.2
    );
  };

  let observer: IntersectionObserver | null = null;
  if (inView()) {
    playAnimation();
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          playAnimation();
          observer?.disconnect();
          observer = null;
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(root);
  }

  return () => {
    tween?.kill();
    observer?.disconnect();
    resizeObserver.disconnect();
    if (ball) ball.style.transform = "";
    dominos.forEach((d) => (d.style.transform = ""));
  };
}
