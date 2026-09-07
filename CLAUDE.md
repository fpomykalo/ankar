# Working agreements for this repo

- **Always work directly on `main`.** Commit and push to `main`; do not create
  feature branches unless explicitly asked. This applies to every project for
  this user, not just Ankar.
- Desktop build only for now (1440px artboard); mobile comes later.
- Every measurement comes from the Figma file (ANKAR — Web, page 3.3 / Desktop).
  Keep type sizes, line-heights, tracking and spacing 1:1 with Figma.
- No em dashes in prose written for the user.

# Stack

Vite + vanilla HTML/CSS/JS, GSAP ScrollTrigger, Lenis. `npm run dev` to work,
`npm run build` for `dist/`. Deployed to GitHub Pages from `main` by
`.github/workflows/deploy.yml` (base path `/ankar/`).
