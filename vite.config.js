import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// VITE_BASE lets the same build serve from a sub-path (GitHub Pages uses /ankar/, /ankar/v02/, ...).
// VITE_NOINDEX=1 adds a robots noindex tag to every page (used for the unlisted work-in-progress build).
const pages = ['index.html', 'product/index.html', 'careers/index.html', 'security/index.html', 'security/letter/index.html', 'resources/index.html', 'resources/article/index.html'].filter((p) => fs.existsSync(resolve(__dirname, p)));

function partials() {
  let base = '/';
  return {
    name: 'ankar-partials',
    configResolved(config) { base = config.base; },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (_, name) => fs.readFileSync(resolve(__dirname, 'src/partials', `${name}.html`), 'utf8'))
          .replace(/<!--\s*@noindex\s*-->/g, process.env.VITE_NOINDEX ? '<meta name="robots" content="noindex, nofollow" />' : '')
          .replace(/\{\{base\}\}/g, base);
      },
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [partials()],
  server: { port: 5173, host: true },
  build: {
    target: 'es2020',
    rollupOptions: { input: Object.fromEntries(pages.map((p) => [p.replace(/\/?index\.html$/, '') || 'home', resolve(__dirname, p)])) },
  },
});
