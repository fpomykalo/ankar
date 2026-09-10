import { bootPage } from '../site.js';
import { stories, posts, highlighted, news } from '../data/pages.js';
import { storyCard, wideCard, pager } from '../lib/cards.js';

function initResources() {
  document.getElementById('stories-folders').innerHTML = stories.map(storyCard).join('');
  document.getElementById('stories-pager').innerHTML = pager(stories.length);
  document.getElementById('highlighted-folders').innerHTML = wideCard(highlighted);
  document.getElementById('recent-folders').innerHTML = posts.map(storyCard).join('');
  document.getElementById('recent-pager').innerHTML = pager(posts.length);
  document.getElementById('newslist').innerHTML = news.map((n) => `
    <div class="nrow"><div class="rule"></div><h3 class="t-h4 nrow__title">${n.title}</h3><span class="t-mono nrow__source">${n.source}</span><a class="t-mono nrow__more" href="#"><u>Read more &gt;</u></a></div>`).join('');

  // the sticky bar's pills filter the posts; a second click on the active pill shows everything again
  const tabs = Array.from(document.querySelectorAll('.rbar__tab'));
  let active = null;
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    active = active === tab.dataset.cat ? null : tab.dataset.cat;
    tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.cat === active));
    document.querySelectorAll('#recent-folders .scard').forEach((card) => { card.hidden = !!active && card.dataset.cat !== active; });
  }));
}

bootPage(initResources);
