# exitMediaGroup Agent Rules

## Project Goal
- Build a static, high-performance marketing site with advanced motion and 3D interaction.
- Ship bilingual UX: French on `/`, English on `/en`.
- Keep content management separate from UI code so non-technical editors can update projects safely.

## Engineering Principles
- Use KISS first: prefer simple, explicit solutions over abstraction-heavy patterns.
- Use DRY with restraint: extract only when duplication is real and recurring.
- Build reusable section modules and shared primitives before adding one-off logic.
- Keep animation logic isolated from content data and presentational markup.

## Stack Defaults
- Frontend: Astro + TypeScript (strict) + Tailwind CSS.
- Motion: GSAP + ScrollTrigger for scroll timelines, Framer Motion for UI micro-interactions.
- 3D: React Three Fiber + Drei for controlled 3D sections.
- Content: Decoupled content repository or content folder schema consumed at build-time.
- Validation: Zod schemas for all content entries.

## Architecture Baseline
- `apps/web`: Astro frontend app.
- `apps/web/src/components`: reusable UI and section components.
- `apps/web/src/sections`: page section compositions (`Section01Hero` ... `Section09Footer`).
- `apps/web/src/lib`: animation helpers, i18n utilities, constants, media helpers.
- `apps/web/src/content`: optional local content fallback for development.
- `content`: editor-facing structured content (locale-separated).
- `docs`: implementation plans, prompt packs, technical decisions.

## i18n Rules
- French is default locale at `/`.
- English lives under `/en`.
- No hardcoded copy in section components.
- Every translatable string must come from locale content payloads.

## Frontend Quality Bar
- Preserve bold visual direction from references; avoid generic template aesthetics.
- Optimize for 60fps on modern devices; degrade gracefully on low-power devices.
- Respect `prefers-reduced-motion`.
- Mobile-first behavior must be explicitly tested for each section.

## Delivery Rules
- For each task: implement, verify, then document.
- Keep PRs/task edits small and scoped to one concern.
- Include basic tests/checks for logic-heavy utilities and content schema validation.
- If a requirement is ambiguous, implement a sensible default and document the assumption.
