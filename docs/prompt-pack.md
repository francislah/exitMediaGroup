# Prompt Pack for AI Implementation

Use these prompts in order. Each prompt is optimized for focused, high-signal execution:
- clear scope
- hard constraints
- explicit deliverables
- validation commands

Replace placeholders like `<ABS_PATH>` before use.

---

## T00 - Bootstrap

```text
You are a senior frontend engineer working in <ABS_PATH>.
Create a production-ready Astro + TypeScript project baseline for a static marketing website.

Requirements:
- Package manager: bun
- Strict TypeScript
- Tailwind CSS
- ESLint + Prettier
- Folder structure for sections/components/lib/content/docs

Deliverables:
1) Initialize project files and scripts.
2) Add a clean README with setup, dev, build, and lint commands.
3) Show the final tree (top 3 levels).

Constraints:
- Keep setup minimal (KISS).
- Avoid premature abstractions.
- No placeholder dependencies unrelated to this project.

Validation:
- Run: bun install
- Run: bun run build
- Run: bun run lint
```

## T01 - Architecture Boundaries

```text
In <ABS_PATH>, implement a scalable but simple architecture for a 9-section homepage.

Requirements:
- Add reusable primitives in src/components/ui
- Add src/sections with Section01...Section09 components
- Add src/lib for i18n, media helpers, and animation utilities
- Wire homepage composition in one page entry

Deliverables:
1) Create file scaffolding with minimal starter code.
2) Add one paragraph in docs/architecture-notes.md explaining boundaries.
3) Keep imports clean and predictable.

Constraints:
- DRY and KISS.
- No business copy hardcoded in section components.
```

## T02 - Design Tokens and Visual System

```text
Create design tokens matching the provided art direction (bold, cinematic, smoke gradient mood).

Requirements:
- CSS variables for colors, spacing, radii, z-index, breakpoints
- Typography scale and utility classes
- Motion tokens (durations, easings)

Deliverables:
1) src/styles/tokens.css
2) src/styles/global.css updated to use tokens
3) brief docs/design-system.md with token naming rules

Constraints:
- Mobile-first
- Maintain contrast accessibility
- Keep token names semantic (not color-literal when avoidable)
```

## T03 - i18n Routing and Locale Utilities

```text
Implement locale routing for:
- French default on /
- English on /en

Requirements:
- Locale-aware routes
- Locale switch helper
- Type-safe translation/content loader function

Deliverables:
1) Routing structure for / and /en
2) src/lib/i18n.ts with strict types
3) no duplicated page logic across locales

Constraints:
- Keep logic framework-native and simple.
- No runtime i18n library unless clearly needed.
```

## T04 - Content Model + Editor Workflow

```text
Create a content schema system so editors can update site content without touching section code.

Requirements:
- Locale-separated content files under content/fr/home and content/en/home
- One file per section (01..09)
- Zod schema validation per section
- Build-time validation script

Deliverables:
1) Initial content files with realistic stub fields
2) src/lib/content-schemas.ts
3) scripts/validate-content.ts
4) docs/content-editing.md for non-technical editors

Constraints:
- Keep schema explicit and stable.
- Section components consume schema output only.
```

## T05 - Section 01 Hero

```text
Implement Section 01 Hero with scroll-linked transformation.

Behavior:
- Smokey background video starts dark and gets vibrant
- 3 domino elements in reversed-E composition
- Main headline emphasis split (100% vs 30% weight feel)
- Arrow with subtle bounce
- On scroll: arrow fades, center domino rises, headline slight scale depth effect
- Transform: center domino widens into 16:9 frame, smoke fades, showreel appears
- Reveal phrase word-by-word with opacity 30% -> 100% linked to scroll

Deliverables:
1) Section01 component with timeline logic
2) Reduced-motion fallback
3) Content-driven text/media fields

Constraints:
- Smooth on mobile and desktop
- Avoid layout thrash; prefer transform/opacity
```

## T06 - Section 02 Clients

```text
Implement Section 02 Clients marquee.

Behavior:
- Two logo rows
- Top row drifts left, bottom row drifts right
- Constant slow speed
- On scroll interaction: accelerate by ~20-25%, then ease back to baseline

Deliverables:
1) Section02 component
2) Accessible logo list markup
3) Pause strategy for reduced motion users
```

## T07 - Section 03 Who We Are

```text
Implement Section 03 Who We Are.

Behavior:
- Left text block, right video (autoplay/muted/loop)
- Gentle fade-in on entry
- Subtle text motion on scroll

Deliverables:
1) Responsive two-column layout collapsing cleanly on mobile
2) Video loading optimization (poster/lazy strategy)
3) Content-driven copy and media
```

## T08 - Section 04 Method

```text
Implement Section 04 Method.

Behavior:
- Gradient headline: "Creativite. Innovation. Impact."
- 3 domino bars under words, low opacity initially
- On scroll: dominos fill sequentially
- After all 3 fill, reveal promise sentence

Deliverables:
1) Timeline animation with deterministic sequencing
2) Fallback static state for reduced motion
3) Content fields for headline and promise text
```

## T09 - Section 05 Expertise

```text
Implement Section 05 Expertise using horizontal interactive panels.

Behavior:
- One panel active by default
- Click panel => smooth expansion
- Other panels compress proportionally
- Active panel content fades in

Deliverables:
1) Keyboard accessible panel controls
2) Mobile behavior (stack or snap-scroll fallback)
3) Reusable panel component for future pages
```

## T10 - Section 06 Projects

```text
Implement Section 06 Projects with orbiting domino cards.

Behavior:
- 6 domino cards orbiting
- Scroll drives slow orbit rotation
- Center card subtly emphasized
- On click: Y-axis flip reveals project video
- Show buttons: "Voir le projet" and "Retour"
- Back action flips card to front

Deliverables:
1) Section06 with robust state handling
2) Progressive enhancement if 3D effects are unsupported
3) Content-driven project entries
```

## T11 - Section 07 Testimonials

```text
Implement Section 07 Testimonials.

Behavior:
- Centered quote
- Domino-style indicators
- Fade out / fade in between testimonials
- No horizontal slider movement

Deliverables:
1) Auto-cycle with manual indicator controls
2) Accessible semantics for quote/source
3) Content-driven list with locale support
```

## T12 - Section 08 Phantom Video

```text
Implement Section 08 Phantom Video scroll expansion.

Behavior:
- Video starts centered with generous whitespace
- On scroll, scales up progressively
- Ends as full section (100vw x 100vh)

Media specs:
- 16:9
- >= 1920x1080
- MP4 H.264
- autoplay muted loop
- object-fit cover

Deliverables:
1) Scroll-linked scale behavior
2) Stable layout with minimal CLS
3) Mobile-safe fallback sizing
```

## T13 - Section 09 Footer

```text
Implement Section 09 Footer interaction.

Behavior:
- Horizontal marquee "ON SE LANCE ?"
- Center CTA
- Circular EXIT icon
- Domino row
- End-of-scroll interaction: circle rolls horizontally and triggers sequential domino fall

Deliverables:
1) Footer scene with deterministic end animation
2) Accessible CTA/link structure
3) Performance-safe animation strategy
```

## T14 - Performance, A11y, SEO

```text
Run a hardening pass across the homepage.

Requirements:
- Lighthouse targets: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95
- Respect reduced motion globally
- Image/video optimization and preload strategy
- Metadata, Open Graph, sitemap, robots

Deliverables:
1) Concrete optimizations applied
2) Report in docs/qa-report.md with before/after metrics
3) List of known tradeoffs and follow-up items
```

## T15 - Final QA and Release Checklist

```text
Prepare final release checklist for desktop + mobile.

Requirements:
- Validate all 9 sections against behavior specs
- Validate FR and EN parity
- Verify interaction states and no console errors
- Add deployment notes

Deliverables:
1) docs/release-checklist.md
2) docs/open-issues.md (if any)
3) concise go/no-go summary
```

---

## One Master Prompt for "Implement Next Task"

```text
You are implementing task <TASK_ID> in <ABS_PATH>.

Follow these rules:
- DRY and KISS
- Reusable components first, but no over-engineering
- Locale copy must come from content files (FR: /, EN: /en)
- Keep animations performant (transform/opacity first)
- Respect prefers-reduced-motion

Process:
1) Read relevant files.
2) Implement end-to-end for this task only.
3) Run validations.
4) Summarize changed files + commands + results.

Do not stop at planning. Execute the task now.
```
