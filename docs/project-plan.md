# exitMediaGroup Implementation Plan

## Recommended Delivery Model
- Work in vertical slices.
- Complete one task at a time with clear acceptance checks.
- Keep content model stable early to prevent rework in sections.

## Phase 0: Foundation
1. `T00` Workspace bootstrap and tooling
2. `T01` Architecture and component boundaries
3. `T02` Design tokens and visual system
4. `T03` i18n routing (`/` + `/en`)
5. `T04` Content model + editor workflow

## Phase 1: Homepage Build (Sections 01-09)
6. `T05` Section 01 Hero
7. `T06` Section 02 Clients
8. `T07` Section 03 Who We Are
9. `T08` Section 04 Method
10. `T09` Section 05 Expertise
11. `T10` Section 06 Projects
12. `T11` Section 07 Testimonials
13. `T12` Section 08 Phantom Video
14. `T13` Section 09 Footer

## Phase 2: Hardening
15. `T14` Performance budget + accessibility + SEO
16. `T15` QA pass (desktop/mobile), analytics, release checklist

## Definition of Done (Per Task)
- Section data comes from locale content source, not hardcoded text.
- Animations are smooth and scoped to component lifecycle.
- Mobile and desktop behavior both implemented.
- No console errors; no layout shift spikes from media loading.
- Task notes include changed files and validation commands run.

## Suggested Repo Layout
```text
exitMediaGroup/
  AGENTS.md
  docs/
    project-plan.md
    prompt-pack.md
  apps/
    web/
      src/
        pages/
        sections/
        components/
        lib/
        styles/
  content/
    fr/
      home/
        section-01-hero.json
        section-02-clients.json
        section-03-who-we-are.json
        section-04-method.json
        section-05-expertise.json
        section-06-projects.json
        section-07-testimonials.json
        section-08-phantom-video.json
        section-09-footer.json
    en/
      home/
        section-01-hero.json
        section-02-clients.json
        section-03-who-we-are.json
        section-04-method.json
        section-05-expertise.json
        section-06-projects.json
        section-07-testimonials.json
        section-08-phantom-video.json
        section-09-footer.json
```
