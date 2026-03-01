/**
 * Scroll lock for Section 04 Method.
 * When section bottom reaches viewport bottom: pin section and consume wheel to fill dominos.
 * When all dominos filled and text revealed: unlock scroll.
 */

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const FILL_SPEED = 0.0012;

export interface MethodScrollLockOptions {
  root: HTMLElement;
  onProgress: (progress: number) => void;
  onComplete: () => void;
}

export function initMethodScrollLock(
  options: MethodScrollLockOptions,
): () => void {
  const { root, onProgress, onComplete } = options;

  let progress = 0;
  let complete = false;
  let locked = false;
  let lockScrollY = 0;

  const getLockScrollY = (): number => {
    const rect = root.getBoundingClientRect();
    const scrollTop = window.scrollY ?? document.documentElement.scrollTop;
    return scrollTop + rect.bottom - window.innerHeight;
  };

  const shouldLock = (): boolean => {
    const rect = root.getBoundingClientRect();
    const vh = window.innerHeight;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const navBottom = header ? header.getBoundingClientRect().bottom : 0;

    return (
      rect.top <= navBottom + 20 &&
      rect.bottom >= vh - 20 &&
      !complete
    );
  };

  const applyLock = () => {
    if (!locked) return;
    const targetY = clamp(lockScrollY, 0, document.documentElement.scrollHeight - window.innerHeight);
    const scrollY = window.scrollY ?? document.documentElement.scrollTop;
    if (Math.abs(scrollY - targetY) > 8) {
      window.scrollTo({ top: targetY, behavior: "auto" });
    }
  };

  const updateProgress = (delta: number) => {
    if (complete) return;
    progress = clamp(progress + delta * FILL_SPEED, 0, 1);
    onProgress(progress);
    if (progress >= 0.999) {
      complete = true;
      locked = false;
      onComplete();
    }
  };

  const wheelHandler = (event: WheelEvent) => {
    if (complete) return;

    if (!shouldLock()) {
      if (locked) {
        locked = false;
      }
      return;
    }

    const mostlyVertical = Math.abs(event.deltaY) > Math.abs(event.deltaX) * 1.05;
    if (!mostlyVertical || Math.abs(event.deltaY) < 0.25) return;

    if (!locked) {
      locked = true;
      lockScrollY = getLockScrollY();
    }

    event.preventDefault();
    applyLock();
    updateProgress(event.deltaY);
  };

  const scrollHandler = () => {
    if (complete) return;

    if (locked) {
      applyLock();
    } else if (shouldLock()) {
      const rect = root.getBoundingClientRect();
      if (rect.bottom >= window.innerHeight - 10) {
        locked = true;
        lockScrollY = getLockScrollY();
        applyLock();
      }
    }
  };

  window.addEventListener("wheel", wheelHandler, { passive: false });
  window.addEventListener("scroll", scrollHandler, { passive: true });
  window.addEventListener("resize", scrollHandler);

  return () => {
    window.removeEventListener("wheel", wheelHandler);
    window.removeEventListener("scroll", scrollHandler);
    window.removeEventListener("resize", scrollHandler);
  };
}
