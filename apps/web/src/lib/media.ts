export interface VideoBehaviorOptions {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
}

export function getDefaultVideoBehavior(
  options: VideoBehaviorOptions = {},
): Required<VideoBehaviorOptions> {
  return {
    autoplay: options.autoplay ?? true,
    muted: options.muted ?? true,
    loop: options.loop ?? true,
    playsInline: options.playsInline ?? true,
    preload: options.preload ?? "metadata",
  };
}

export function getAspectRatioStyle(width: number, height: number): string {
  return `aspect-ratio: ${width} / ${height};`;
}
