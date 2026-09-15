import { bootPage } from '../site.js';
import { lenis } from '../lib/scroll.js';
import { stories, blogGrid, press, news } from '../data/pages.js';
import { storyCard, postCard, pressCard, initStrip } from '../lib/cards.js';

const PAGES = 3; // until more stories arrive, every strip repeats its first page
const pagesOf = (items, make) => Array.from({ length: PAGES }, () => items.map(make));
const layoutTop = (el) => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };

function initResources() {
  initStrip({ folders: 'stories-folders', pager: 'stories-pager', pages: pagesOf(stories, storyCard) });
  initStrip({ folders: 'blog-folders', pager: 'blog-pager', pages: pagesOf(blogGrid, postCard) });
  initStrip({ folders: 'press-folders', pager: 'press-pager', pages: pagesOf(press, pressCard) });
  document.getElementById('newslist').innerHTML = news.map((n) => `
    <div class="nrow"><div class="rule"></div><h3 class="t-h4 nrow__title">${n.title}</h3><span class="t-mono nrow__source">${n.source}</span><a class="t-mono nrow__more" href="#"><u>Read more &gt;</u></a></div>`).join('');

  // arriving with #brand (the press kit link in the menu): the brand divider lands 40px under the nav
  if (location.hash === '#brand') {
    const rule = document.getElementById('brand');
    const land = () => lenis.scrollTo(layoutTop(rule) - 120, { immediate: true, force: true });
    requestAnimationFrame(land); setTimeout(land, 150);
  }

  // the sticky pills are anchors (their divider lands 40px under the nav, like every anchor) and follow the scroll
  const tabs = Array.from(document.querySelectorAll('.rbar__tab'));
  const ruleOf = (tab) => document.getElementById(tab.dataset.target);
  const spy = () => {
    let active = null;
    tabs.forEach((tab) => { if (ruleOf(tab).getBoundingClientRect().top <= 121) active = tab; });
    tabs.forEach((t) => t.classList.toggle('is-active', t === active));
  };
  lenis.on('scroll', spy);
  spy();
}

bootPage(initResources);
