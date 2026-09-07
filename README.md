# Ankar — marketing site

Desktop build of the Ankar homepage, implemented 1:1 from the Figma file
(ANKAR — Web, page 3.3 / Desktop artboard, 1440px). Mobile comes later.

## Stack

- **Vite** (vanilla HTML/CSS/JS, no framework)
- **GSAP 3 + ScrollTrigger** for every scroll-driven scene
- **Lenis** for smooth scrolling (synced to GSAP's ticker)
- Self-hosted fonts via Fontsource: Crimson Pro (variable, weight 200),
  Crimson Text (400 / 600), DM Mono (300 / 400)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview
```

## Layout

- `index.html` — all markup, section by section, in page order
- `src/styles/base.css` — tokens + type ramp (sizes, line-heights, tracking
  straight from Figma; text boxes are cap-trimmed with `text-box-trim`)
- `src/styles/components.css` — buttons, folder-tab shapes (CSS masks),
  vertical tab labels, grain overlay
- `src/styles/sections.css` — per-section positions (Figma x − 80 for
  horizontal, distance from the section's divider line for vertical)
- `src/data/content.js` — copy for the data-driven sections (pills, lifecycle
  cards, industries, partnerships, people, quotes)
- `src/sections/*.js` — one module per animated scene
- `src/illustrations/*.html` — the three supplied HTML/CSS illustration loops

## Scenes

| Section | Behaviour |
| --- | --- |
| Hero | video background, staggered fade-up reveal, slow logo marquee inside the masked strip |
| Challenge → Evidence | the Insight callout rotates 90° CCW, its tab slides up and it grows into the "2x" card; the "40%" card slides in from the right (scroll-scrubbed). Hover = red/white active state, last hovered stays active |
| Knowledge takeover | pinned: gradient rises at 80% of the viewport, expands to full screen, pills travel from the back to the front for each group, the title swaps per group, then the gradient shrinks into the illustration panel and the accordion phases are scrubbed (also clickable) |
| Lifecycle | four cards on a circular carousel: hover fans them out, drag / horizontal wheel / arrows rotate it |
| Industries, People, Customers | folder accordions: hover opens a card, the last hovered stays open. People has 12 entries in pages of 4 (arrows, counter, dots) |
| Life sciences | pinned: the photo grows to take the left of the viewport, the blue folder slides in from the right, copy rises |
| More than software | six rows, hover reveals the copy (last hovered stays) |
| Closing | the product mock grows from 880px to 1280px wide while scrolling; the footer then slides up over the section |

Every "comes up and fades in" element uses `data-reveal` (a fade-up reveal:
40px rise + opacity 0 → 1, `power3.out`).
