# Content Editing Guide

This project keeps content separate from implementation code.

## Where to edit
- French homepage content: `/Users/FrancisData/Documents/Github/exitMediaGroup/content/fr/home`
- English homepage content: `/Users/FrancisData/Documents/Github/exitMediaGroup/content/en/home`

Each locale has one file per section:
- `section-01-hero.json`
- `section-02-clients.json`
- `section-03-who-we-are.json`
- `section-04-method.json`
- `section-05-expertise.json`
- `section-06-projects.json`
- `section-07-testimonials.json`
- `section-08-phantom-video.json`
- `section-09-footer.json`

## Editing rules
1. Keep JSON valid:
   - Always use double quotes.
   - Do not leave trailing commas.
2. Keep required fields:
   - Do not remove keys such as `key`, `anchorId`, `heading`, or section-specific required fields.
3. Keep URLs complete for external links:
   - Use `https://...` for `href` fields.
4. Preserve media specs where required:
   - Section 08 video metadata must stay `mp4`, `h264`, and at least `1920x1080`.

## Validate before publishing
From `/Users/FrancisData/Documents/Github/exitMediaGroup/apps/web`:
- `bun run content:validate`

If validation passes, content is safe to build:
- `bun run build`

## Common mistakes
- Changing `key` to a different section ID.
- Deleting required arrays (for example `testimonials` or `panels`).
- Using relative external URLs (must be full `https://` links).
