import { bootPage } from '../site.js';
import { posts } from '../data/pages.js';
import { postCard, initStrip } from '../lib/cards.js';

function initArticle() {
  // the same three posts as the first row of the blog grid on Resources
  initStrip({ folders: 'next-folders', pager: 'next-pager', pages: Array.from({ length: 3 }, () => posts.slice(0, 3).map(postCard)) });
}

bootPage(initArticle);
