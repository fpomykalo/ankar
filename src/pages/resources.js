import { bootPage } from '../site.js';
import { stories, posts, highlighted, news } from '../data/pages.js';
import { storyCard, wideCard, initStrip } from '../lib/cards.js';

const PAGES = 3; // until more stories arrive, every strip repeats its first page
const pagesOf = (cards) => Array.from({ length: PAGES }, () => cards.map(storyCard));

function initResources() {
  // the sticky bar's pills filter the posts; a second click on the active pill shows everything again
  let active = null;
  const applyFilter = () => document.querySelectorAll('#recent-folders .strip__page').forEach((pageEl) => {
    let first = true;
    pageEl.querySelectorAll('.scard').forEach((card) => {
      card.hidden = !!active && card.dataset.cat !== active;
      if (card.hidden) return;
      card.style.marginLeft = first ? '0' : ''; // only the first visible card sits flush; the rest overlap by their 25px tab
      first = false;
    });
  });

  initStrip({ folders: 'stories-folders', pager: 'stories-pager', pages: pagesOf(stories) });
  document.getElementById('highlighted-folders').innerHTML = wideCard(highlighted);
  initStrip({ folders: 'recent-folders', pager: 'recent-pager', pages: pagesOf(posts), onRender: applyFilter });
  document.getElementById('newslist').innerHTML = news.map((n) => `
    <div class="nrow"><div class="rule"></div><h3 class="t-h4 nrow__title">${n.title}</h3><span class="t-mono nrow__source">${n.source}</span><a class="t-mono nrow__more" href="#"><u>Read more &gt;</u></a></div>`).join('');

  const tabs = Array.from(document.querySelectorAll('.rbar__tab'));
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    active = active === tab.dataset.cat ? null : tab.dataset.cat;
    tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.cat === active));
    applyFilter();
  }));
}

bootPage(initResources);
