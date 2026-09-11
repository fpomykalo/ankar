import { bootPage } from '../site.js';
import { posts } from '../data/pages.js';
import { storyCard, initStrip } from '../lib/cards.js';

function initArticle() {
  initStrip({ folders: 'next-folders', pager: 'next-pager', pages: Array.from({ length: 3 }, () => posts.map(storyCard)) });
}

bootPage(initArticle);
