# Ankar website: type and colour

Read from the shipped stylesheets of the v02 build (src/styles). Measurements in CSS pixels at the 1440px desktop artboard.

## Typefaces

| Family | Role | Cuts used | Source | Fallback stack |
|---|---|---|---|---|
| Crimson Pro | Display, all headings | ExtraLight 200 (variable font, wght 200 to 900) | @fontsource-variable/crimson-pro 5.3.0 | 'Crimson Pro', Georgia, serif |
| Crimson Text | Body copy, captions | Regular 400, SemiBold 600 (bold phrases in captions) | @fontsource/crimson-text 5.3.0 | 'Crimson Text', Georgia, serif |
| DM Mono | Labels, nav, buttons, tabs, metadata | Regular 400 (Light 300 loaded, not placed) | @fontsource/dm-mono 5.3.0 | 'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace |

Headings, labels and button text use `text-box-trim: trim-both; text-box-edge: cap alphabetic`, so positions are measured to the cap height. Body text is antialiased (`-webkit-font-smoothing: antialiased`).

## Type scale (size / line-height, tracking)

| Style (class) | Face and weight | Size / leading | Tracking | Used for |
|---|---|---|---|---|
| Display (.t-display) | Crimson Pro 200 | 130 / 110 | -4px | Page titles, homepage hero |
| Heading 2 (.t-h2) | Crimson Pro 200 | 80 / 70 | -2px | Section titles, product group titles, closing title |
| Heading 3 (.t-h3) | Crimson Pro 200 | 52 / 46 | -1px | People names, wide story titles, article title, careers column titles |
| Heading 4 (.t-h4) | Crimson Pro 200 | 36 / 36 | -1px | Accordion and workflow titles, story cards, jobs, news headlines, security items |
| Lead (.t-lead) | Crimson Pro 200 | 30 / 32 | -1px | Row titles on the founders' letter |
| Quote mark (.fcard__quote-mark) | Crimson Pro 200 | 86 / 36 | -1px | Opening quote glyph on team cards |
| Body (.t-body) | Crimson Text 400 (600 for bold) | 18 / 26 | 0 | All running copy |
| Body tight (.nav__case-title) | Crimson Text 400 | 18 / 20 | 0 | Mega-menu use-case card titles |
| Body small (.footer__about) | Crimson Text 400 | 10 / 12 | 0 | Footer company paragraph |
| Label (.t-mono) | DM Mono 400 | 12 / 14 | 0 | Eyebrows, nav, buttons, tabs, card labels, metadata, footer links, form fields. Sentence case |
| Button (.btn) | DM Mono 400 | 12 / 14 | 0 | 40px tall, 20px side padding, 20px radius |
| Label large (.t-mono-lg) | DM Mono 400 | 20 / 14 | 0 | Footer "Book a Demo" inside "Invention reinvented." |
| Defined, unused | Crimson Pro 200 140 / 140, -10px (.t-num); DM Mono 300 36 / 14 (.t-mono-light) | | | Not placed on any page |

Links: inline underline 1px, 2px offset. Current page in the nav: underline 1px, 3px offset. Hover on text links: opacity .6 (rgba(0,0,0,.6) inside the mega-menu).

## Solid colours

| Name | Hex | Token | Used for |
|---|---|---|---|
| Ground | #EEF2F6 | --bg (also --footer-ink) | Page background; ink on the footer and on photo cards |
| Ink | #000000 | --ink | Text, black button, active tabs, mega-menu lines |
| Paper | #FFFFFF | --paper | Text on photos and dark panels, white button, hover fill of blue and glass buttons |
| Rule | #CDD9E5 | --rule, --muted | 1px dividers on light ground; muted text |
| Rule, footer | #BCCCDC | | Footer column dividers (columns at 30% opacity) |
| Blue | #94B9EB | --blue | Accent: eyebrow dots, blue button, Antheros take-over panel |
| Footer | #182553 | | Solid ground under the footer gradient |
| Hero fallback | #0D1D4A | | Behind the inner-page hero gradient while it loads |
| Explore | #BA484F | --red | Lifecycle card 1 |
| Invent & Experiment | #2F3D86 | --indigo | Lifecycle card 2 |
| Protect | #162247 | --navy | Lifecycle card 3 |
| Plum | #894C6B | --purple | Declared, not used yet |

## Gradients

Large colour fields are gradient photographs in public/assets/images/gradients/: gradient-hero.jpg (inner-page heroes), gradient-2-landscape.jpg (brand box, security panel), gradient-1.jpg, gradient-2.jpg, gradient-3.jpg (homepage hero, footer, closing). Each has the noise texture over it at 15% opacity, overlay blend.

## Glass, shades and overlays

| Where | Fill | Blur | Highlight |
|---|---|---|---|
| Nav bar, mega-menu, tabs, filter pills, email field | rgba(255,255,255,.5) | 3px (10px with the mega-menu open) | inset 0 2px 2px and inset 0 -2px 2px rgba(255,255,255,.4) |
| Glass buttons on photos and gradients | rgba(255,255,255,.3), hover .38 | 1.5px | same inset pair |
| Product screenshot frames | rgba(255,255,255,.49) | 1.5px | same inset pair |
| Footer "Book a Demo" pill | rgba(222,229,237,.3), hover #FFFFFF | 1.5px | same inset pair |
| Hairlines on photos and dark panels | rgba(255,255,255,.4); mega-menu cards rgba(238,242,246,.4) | | |
| Photo shade, card open | rgba(0,0,0,.2); people cards .1; expanded bio .7; mega-menu cards .4 and .6 | | |
| Photo gradient, right edge | rgba(0,0,0,.5) to transparent over the last 30%, 270deg | | |
| Photo gradient, bottom | rgba(0,0,0,.5) at 20% to transparent at 40%, 0deg | | |
| Mega-menu card vignette | #000 to transparent over the top 20% and bottom 20% | | |
| Inactive pager dots | rgba(0,0,0,.2), active #000 | | |
| Input placeholder | rgba(0,0,0,.3) | | |
| Photos at rest | grayscale(1); colour returns on the open card over 0.7s | | |

## Shape and rhythm

- Container 1280px in 80px gutters on the 1440px artboard. Sections 120px apart, from the previous content to the next divider.
- Radius 30px on large panels, cards and glass bars; 20px on buttons and tabs; 10px on mega-menu cards.
- Eyebrow dot 8px with a 10px gap. Section head: divider, eyebrow 20px below, title 58px below.
- Folder cards 480px tall with a 25px tab on the left.
- Easing: cubic-bezier(.22,1,.36,1) for arrivals, cubic-bezier(.65,0,.35,1) for in-out moves.
