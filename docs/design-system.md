# Design System Tokens

## Naming Rules
- Use semantic token names by intent, not raw hue names:
  - `--color-bg-*` for surfaces/backgrounds
  - `--color-text-*` for hierarchy/contrast levels
  - `--color-accent-*` for brand emphasis and interaction highlights
- Keep scale families consistent:
  - spacing: `--space-2xs` to `--space-4xl`
  - radius: `--radius-sm` to `--radius-xl`
  - motion: `--motion-duration-*`, `--motion-ease-*`
- Use reference tokens for layout breakpoints (`--breakpoint-sm`...`--breakpoint-xl`) while keeping implementation mobile-first.

## Usage Rules
- Prefer global utility classes that map directly to tokens (`.type-kicker`, `.type-title`, `.surface-panel`, `.text-muted`).
- Keep section-specific style logic inside section files; keep cross-section visual primitives in `src/styles/global.css`.
- Respect contrast hierarchy:
  - primary text on dark surfaces uses `--color-text-primary`
  - secondary/supporting text uses `--color-text-secondary` or `--color-text-muted`
- Motion defaults use tokenized durations/easing and must degrade under `prefers-reduced-motion`.
