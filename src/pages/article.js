import { bootPage } from '../site.js';
import { posts } from '../data/pages.js';
import { storyCard, pager } from '../lib/cards.js';

function initArticle() {
  document.getElementById('next-folders').innerHTML = posts.map(storyCard).join('');
  document.getElementById('next-pager').innerHTML = pager(posts.length);
}

bootPage(initArticle);
