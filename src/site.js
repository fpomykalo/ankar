import '@fontsource-variable/crimson-pro';
import '@fontsource/crimson-text/400.css';
import '@fontsource/crimson-text/600.css';
import '@fontsource/dm-mono/300.css';
import '@fontsource/dm-mono/400.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/pages.css';

import { ScrollTrigger } from './lib/scroll.js';
import { initReveal } from './lib/reveal.js';
import { initNav } from './sections/nav.js';
import { initClosing } from './sections/closing.js';

/** Boots the chrome every inner page shares, then the page's own init. */
export function bootPage(init) {
  document.fonts.ready.then(() => {
    init?.();
    initClosing();
    initReveal();
    initNav();
    ScrollTrigger.refresh();
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
