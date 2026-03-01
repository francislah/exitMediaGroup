# Architecture Decision Record - Website Build Options

Date: 2026-02-27  
Status: Accepted (for MVP direction)  
Scope: Bilingual (FR `/`, EN `/en`) high-motion static marketing site with content separated from implementation.

## 1) Requirements Summary
- Static-first marketing site with advanced motion and 3D interactions.
- French default locale at `/`, English at `/en`.
- Agency should update content without editing section logic.
- Strong performance target on mobile and desktop.
- Reusable code structure (DRY) without over-engineering (KISS).

## 2) Options Reviewed

### Option A - Framer-first (no-code/low-code)
Tools:
- Framer site builder + built-in CMS/localization add-ons.

Cost signals (official pricing pages, checked 2026-02-27):
- Pro: `$30/mo` (annual billing display), locales add-on: `$20/locale`, additional editors on Pro: `$40/editor`.
- Practical example with 2 locales and 1 extra editor: `30 + 20 + 40 = $90/mo` before taxes/usage add-ons.
- Your example of `$54/mo` can happen in legacy/older plan mixes or different billing assumptions, but current public pricing shows higher totals once locales/editors are added.

Complexity:
- Build speed: Low complexity, fastest launch.
- Advanced custom animation behavior: Medium/High risk for constraints and edge cases.
- Long-term maintainability with highly custom interactions: Medium risk.

Tradeoffs:
- Pros: Fast authoring, lower engineering ramp-up, good for standard marketing pages.
- Cons: Cost scales with locales/editors/features, constrained custom behavior, portability/vendor lock-in.

### Option B - Webflow-first
Tools:
- Webflow CMS + hosting + interactions.

Cost signals (checked 2026-02-27):
- CMS Site plan: `$23/mo` (annual), Business: `$39/mo` (annual).
- Localization and workspace seats add additional cost depending on team and setup.

Complexity:
- Build speed: Low/Medium.
- Highly custom timeline-driven interaction fidelity: Medium/High.

Tradeoffs:
- Pros: Mature CMS editing workflow, faster than full custom for standard sections.
- Cons: Cost and feature gating at scale, complex custom 3D/interaction logic can become brittle.

### Option C - Full custom Next.js + headless CMS
Tools:
- Next.js + TypeScript + GSAP/Three.js.
- Optional CMS (Storyblok/Contentful/Sanity/etc.) or Git-based content.

Cost signals:
- Framework license: `$0`.
- Hosting example (Vercel): Hobby free, Pro `$20/mo + usage`.
- CMS varies (for example Storyblok Growth starts at `$99/mo`; free tier exists but limited).
- Video delivery/storage remains separate if using dedicated video infra.

Complexity:
- Build speed: Medium/High.
- Flexibility: Very high.

Tradeoffs:
- Pros: Maximum control and scalability, strong ecosystem.
- Cons: Higher engineering overhead; for static-heavy pages, runtime model can be more than needed.

### Option D - Full custom Astro + content repository (recommended)
Tools:
- Astro + TypeScript + Tailwind + GSAP (+ optional React Three Fiber for 3D sections).
- Content files (JSON/Markdown) with schema validation.
- Hosting: Cloudflare Pages or Netlify free/personal tiers.
- Video infra: Cloudflare Stream or Bunny Stream.

Cost signals:
- Framework license: `$0`.
- Static hosting can be `$0` on free tiers (limits apply).
- Cloudflare Stream example pricing: `$5 / 1,000 minutes stored` (prepaid) and `$1 / 1,000 minutes delivered`.
- Bunny Stream pricing signal: encoding free, storage from `$0.01/GB`, CDN from `$0.005-$0.01/GB` depending on network/region.

Complexity:
- Build speed: Medium.
- Long-term maintainability: High (if section/component boundaries are enforced).
- Performance ceiling: High for static marketing pages.

Tradeoffs:
- Pros: Best control/performance/cost balance, minimal runtime JS by default, no hard vendor lock-in.
- Cons: Requires engineering implementation discipline and initial architecture setup.

## 3) Decision Matrix (MVP Fit)

Scoring: 1 (worst) to 5 (best)

| Criteria | Framer | Webflow | Next.js Custom | Astro Custom |
|---|---:|---:|---:|---:|
| Upfront build speed | 5 | 4 | 2 | 3 |
| Advanced animation freedom | 3 | 3 | 5 | 5 |
| Bilingual route control (`/`, `/en`) | 3 | 3 | 5 | 5 |
| Content-code separation flexibility | 3 | 4 | 5 | 5 |
| Long-term vendor lock-in risk | 2 | 2 | 5 | 5 |
| Baseline recurring platform cost control | 2 | 3 | 4 | 5 |
| Static performance potential | 3 | 3 | 4 | 5 |
| Total | 21 | 22 | 30 | 33 |

## 4) Cost Reality Check (Simple Scenario Estimates)

Assumptions for comparison:
- 1 marketing site, 2 locales, agency content updates by at least 2 internal editors.
- Heavy media and animation (video hosting/delivery considered separately where needed).

Approximate monthly ranges:
- Framer route:
  - Pro + 1 locale add-on + 1 extra editor ~= `$90/mo` before taxes and optional add-ons.
  - Can increase with more locales/editors/usage.
- Webflow route:
  - CMS/Business site plan baseline `$23-$39/mo` before localization/workspace add-ons.
- Custom Astro/Next route:
  - Framework cost `$0`.
  - Hosting can start at `$0` free tier.
  - Video costs are usage-based and become the main variable:
    - Cloudflare Stream or Bunny Stream often dominate monthly spend before compute does for static sites.

Conclusion on cost:
- For this project shape, full custom static architecture keeps fixed platform cost lowest and makes spend more directly tied to real traffic/video usage.

## 5) Final Decision
- Choose **Option D: Astro custom build + decoupled content repository + dedicated video CDN**.

Why:
- Best fit for high-fidelity interaction requirements across Sections 01-09.
- Strong performance profile for static marketing pages.
- Clean separation between content and code for agency editors.
- Better cost control vs platform lock-in when locales/editors/features grow.

## 6) Implementation Strategy (aligned with this repo)
- `T00`: Bootstrap Astro + TS strict + Tailwind + ESLint + Prettier.
- `T01-T04`: lock architecture, i18n routes, and content schemas.
- `T05-T13`: implement sections as isolated modules using content-driven props.
- `T14-T15`: hardening (performance, accessibility, QA, release checklist).

## 7) Risk Register and Mitigations
- Risk: animation complexity causes regressions.
  - Mitigation: isolate section timelines; enforce reduced-motion fallback.
- Risk: content schema drift over time.
  - Mitigation: strict Zod validation at build time.
- Risk: video bandwidth costs spike.
  - Mitigation: separate video CDN account, monitor usage, optimize codecs/length/posters.
- Risk: mobile jank from 3D.
  - Mitigation: progressive enhancement and graceful fallback for low-power devices.

## Sources (pricing/docs checked on 2026-02-27)
- Framer pricing: https://www.framer.com/pricing
- Vercel pricing: https://vercel.com/pricing
- Cloudflare Stream pricing: https://developers.cloudflare.com/stream/pricing/
- Cloudflare Pages limits/pricing notes:
  - https://developers.cloudflare.com/pages/platform/limits/
  - https://developers.cloudflare.com/pages/functions/pricing/
- Bunny Stream pricing:
  - https://bunny.net/pricing/stream/
  - https://docs.bunny.net/docs/stream-pricing
- Netlify pricing: https://www.netlify.com/pricing/
- Webflow pricing: https://webflow.com/pricing
- Storyblok pricing: https://www.storyblok.com/pricing
