import '@fontsource-variable/crimson-pro';
import '@fontsource/crimson-text/400.css';
import '@fontsource/crimson-text/600.css';
import '@fontsource/dm-mono/300.css';
import '@fontsource/dm-mono/400.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import { ScrollTrigger } from './lib/scroll.js';
import { initReveal } from './lib/reveal.js';
import { initHero } from './sections/hero.js';
import { initNav } from './sections/nav.js';
import { initEvidence } from './sections/evidence.js';
import { initKnowledge } from './sections/knowledge.js';
import { initLifecycle } from './sections/lifecycle.js';
import { initIndustries, initBios, initQuotes } from './sections/folders.js';
import { initLifeSciences } from './sections/lifesciences.js';
import { initPartnerships } from './sections/partnerships.js';
import { initClosing } from './sections/closing.js';

function boot() {
  // render data-driven sections first so measurements are right
  initLifecycle();
  initIndustries();
  initPartnerships();
  initBios();
  initQuotes();

  // scroll scenes in document order (pins must be created top to bottom)
  initHero();
  initEvidence();
  initKnowledge();
  initLifeSciences();
  initClosing();
  initReveal();
  initNav();

  ScrollTrigger.refresh();
}

document.fonts.ready.then(boot);
window.addEventListener('load', () => ScrollTrigger.refresh());
