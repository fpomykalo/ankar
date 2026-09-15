# Ankar website: developer handoff

This folder is everything a developer needs to rebuild the Ankar marketing site in Framer, or to take over the current code. It sits next to the source of the site it describes.

- Live build of this exact state: https://fpomykalo.github.io/ankar/v02/ (pages: `/product/`, `/careers/`, `/security/`, `/security/letter/`, `/resources/`, `/resources/article/`)
- Design source: Figma file `ANKAR — Web`, key `amR3f07jEVMx1Q4m1XRCQc`, page 4.2 for the current layouts, page 3.3 for the earlier homepage
- Repository: github.com/fpomykalo/ankar, branch `v02`

Desktop only for now: everything is drawn on a 1440px artboard with a 1280px container. Mobile is a later pass.

## What is in the zip

```
ankar-handoff/
  README.md                 this file
  source/                   the repository as it is (no node_modules); run it with npm
  site-build/               the built site as static files; open with any web server
  handoff/                  this folder, also inside source/
    type-and-colour.md      every typeface, cut, size and colour, with where each is used
    type-and-colour.html    the same as a page with live specimens and swatches
    content/*.json          all copy and data, one file per collection
    framer/                 styles and code components for Framer (see below)
```

Photos, logos, gradients, the hero video and the UI screenshots are in `source/public/assets/` (18 MB). Sizes are already tuned to their 2x display size; the logos come in `-white` and `-black` cuts and are picked by name in the code.

## The site today

Vite, plain HTML, CSS and JavaScript. GSAP with ScrollTrigger drives the scroll-linked motion, Lenis the smooth scroll. Fonts come from the Fontsource packages (Crimson Pro variable, Crimson Text 400 and 600, DM Mono 300 and 400).

```
npm install
npm run dev        # http://localhost:5173
npm run build      # writes dist/
```

Where things live in `source/`:

- `index.html` and `<page>/index.html`: one file per page. The nav, closing section and footer are partials in `src/partials/`, pulled in at build time.
- `src/data/`: the copy. `content.js` (homepage), `pages.js` (careers, security, resources, article), `product.js`. The same data is exported as JSON in `handoff/content/`.
- `src/styles/`: `base.css` (tokens, type scale), `components.css` (buttons, folder cards), `sections.css` (homepage and nav), `pages.css` (inner pages).
- `src/sections/`: homepage behaviours. `src/pages/`: one script per inner page. `src/lib/`: scroll, reveal, cards, image pre-decoding.
- `src/illustrations/`: the three animated SVG illustrations.

## Rebuilding in Framer

Roughly four fifths of the site is native Framer: text and colour styles, stacks, sticky elements, component variants with hover and transitions, Appear effects. Five pieces need code components. Suggested order: styles, then the folder card component, then the seven page layouts, then the take-over last.

### 1. Styles

`framer/styles.json` lists every Text Style and Color Style with the exact values. Two ways in:

- `framer/import-styles-plugin.ts` creates them in one click through a small Framer plugin (instructions at the top of the file, about ten minutes).
- Or enter them by hand from the Assets panel; there are twelve text styles and twelve solid colours.

All three families are on Google Fonts, which Framer serves directly. Only Crimson Pro 200, Crimson Text 400 and 600, and DM Mono 400 are used.

One thing Framer cannot express: the site trims text to the cap height (`text-box-trim`), so every measurement like "title 20px under the rule" is to the top of the capitals. Without the trim the same text sits about 3px lower at 12px and up to 20px lower at 130px. Either add `text-box-trim: trim-both; text-box-edge: cap alphabetic` through Site Settings › Custom Code for headings and labels, or accept the offset and keep the project simpler. Accepting it is fine.

### 2. Layouts

The Figma file is the source of every measurement, and Framer's Figma import plugin brings the static layouts across with their text styles. `type-and-colour.md` has the constants that recur everywhere: 120px between sections, divider then eyebrow at 20 then title at 58, 30px radius on panels, 20px on buttons.

Glass surfaces (nav bar, mega-menu, tabs, pills, the email field) are native Framer: fill white at 50%, backdrop blur 3px, and two inset shadows of white at 40%, 2px blur, offset 2px up and 2px down.

### 3. Code components (`framer/`)

- `FolderCard.tsx`: the photo card with the tab on its left edge and the vertical label. Used for people, industries, stories, posts and the lifecycle cards. The shape is a CSS mask; property controls expose the tab position, shade, gradients and grayscale.
- `Illustration.tsx` with `illustrations.ts`: the three animated illustrations. They play once on insert; change the replay key to play again.
- `GlassButton.tsx`: the pill button with its four fills and hover states, mostly as documentation of the exact values; a Framer component with variants does the same.

Two more will need writing in Framer from the behaviour notes below: the Antheros take-over and the people strip.

### 4. Behaviours to reproduce

Navigation

- Fixed glass bar, 1280 × 60 at 20px from the top. Menu items: Home with a chevron, Product, Careers, Security, Resources. The current page is underlined (1px, 3px offset).
- Hovering Product, Careers, Security or Resources opens the mega-menu: the bar grows to 440px tall and shows three columns. Left: "Product > Explore" with the four workflow groups and their workflows, single-spaced, every line a link to the product page. Middle: Careers, Security (with "Note from our founders on security" beneath), Resources (with "Press kit" beneath). Right: Case studies with two 298 × 176 photo cards (Antheros, L’Oréal), each linking to the article page, and a "View all" link.
- Hovering Home shows a small 163 × 244 glass list of on-page anchors. Clicking Home goes to the homepage. Anchors land with the section's divider 40px under the nav.
- After a page loads, hover-opening is disabled for half a second so the menu you just clicked does not reopen under the cursor.
- Every text link in the site fades to 60% on hover.

Reveals

- Sections rise 40px and fade in over 1.2s when their top passes 90% of the viewport, once. Small delays stagger eyebrow, title, body and cards.
- Every image is decoded ahead of time after load so a reveal never waits on a decode.

Homepage

- Hero with the video background and two CTAs. "Explore the platform" links to the product page.
- What Ankar makes possible: three items open on hover, the open item's illustration plays once, a click on the open item replays it.
- Lifecycle: three folder cards (Explore red, Invent & Experiment indigo, Protect navy). The open one is 931px wide.
- Built for consequential R&D: five industry folder cards, open card 557px. The Life Sciences card carries a "Watch the Antheros story" button; clicking the button or anywhere on the card opens the take-over.
- Take-over: the section grows by a viewport height minus 480, the page eases so the take-over fills the viewport, the photo grows out of its card to 786px wide while the blue panel slides in from the right with the copy. The section head stays visible above it. A click anywhere closes it (except on the story button). If it scrolls fully out of view it closes itself without moving what is on screen. In Framer this is best rebuilt with layout animations rather than ported.
- More than software: four rows in two columns, open on hover, only one open per column. The section is sized so the next divider sits 50px under the tallest open row.
- Developed by: divider, eyebrow, then a viewport-wide strip of eight people cards, open card 744px, closed 212px, paged by four with dots. Drag scrolls the strip. A click on the open card expands the full bio with its own scrollbar.
- Enterprise trust: two columns with the SOC 2 and ISO 27001 badges and two CTAs.
- Closing "What could your team invent next?" with the product screenshot, 120px under the content. Footer with the "Invention reinvented." line, four columns at 30% opacity, and the Ankar wordmark.

Product

- Hero, then one workflow group at a time. The tab row (Explore, Invent, Protect, Collaborate) is sticky 20px under the nav while the group scrolls; the group title is not sticky. A tab cross-fades the group in place and, if the head has scrolled away, settles the page so the group's divider sits 40px under the nav. The tabs release once their top is 20px below the last workflow image.
- URL hashes select a group (`#invent`) or a workflow (`#experiment-design`, which selects its group and scrolls to it). The mega-menu and the footer use these.
- Each workflow: divider, number, title, body on the left; a 740px screenshot frame on the right, alternating two frame styles.

Careers

- Hero, two "Empowering inventors" and "We're at an inflection point" pairs, two team quote cards (open 1118px, hover swaps), Our Principles and Benefits & perks columns, the Employee story wide card, Join us with the jobs list in four teams. No closing section; the footer follows the list.

Security

- Hero with the founders' note link. Three items open on hover; the gradient panel on the right shows the open item's rows and is sized to the tallest item. The section keeps that height whichever item is open.
- The letter page: hero, the photo card, then six titled rows of copy.

Resources

- Hero with "Press kit", which anchors to the brand block with its divider 40px under the nav and everything above it off screen.
- Customer stories strip: three cards, three pages that slide left and right. Then the sticky filter pills (Blog, Press) 20px under the nav; a pill hides the other posts, a second click shows all, and the first visible card always sits flush left. Highlighted wide card, Most recent strip, In the news list of five rows, then the brand block on its gradient. The pills release once their top is 20px below the last news title.
- Article page: date, title, photo card with its category label, author with avatar, a glass email field with a grey placeholder, share links, the body, then a "Read next" strip.

Sticky rule used everywhere: a sticky element sits 20px under the nav (top of the pills at 100px) and releases when its top is 20px below the last element of its section.

## Open items the developer will meet

- Links that still point nowhere: Book a Demo (all of them), Apply now, Read more, View all, Download brand assets, the article share links.
- Placeholder photos: the article hero and two of the three post cards reuse industry photos.
- Every card strip repeats its first page on pages 2 and 3 until more stories exist.
- Footer: "Client one / two / three" under Case studies are placeholders.
- Two type styles are defined but unused (`.t-num` 140/140 and `.t-mono-light` 36/14), and DM Mono 300 is loaded only for the unused one.

## Assets worth knowing about

- `public/assets/videos/hero-video-1.mp4` is 12 MB (CRF 24). A 5.4 MB CRF 28 version is in `source-assets/videos/` if a lighter hero is wanted.
- The gradients are photographs (`public/assets/images/gradients/`), each shown with the noise texture over it at 15% in overlay blend.
- The life sciences photo is kept at 2000px because the take-over shows it at 786 × 900.
