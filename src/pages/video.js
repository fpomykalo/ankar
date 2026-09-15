import { bootPage } from '../site.js';
import { posts } from '../data/pages.js';
import { postCard, initStrip } from '../lib/cards.js';

/** The video article: the poster with a play mark swaps to the YouTube player (data-youtube on the
 *  card) when clicked, and Read next shows the same three posts as the blog grid. */
function initVideo() {
  const card = document.getElementById('vcard');
  card?.querySelector('.vcard__play')?.addEventListener('click', () => {
    const id = card.dataset.youtube;
    if (!id || card.classList.contains('is-playing')) return;
    const frame = document.createElement('iframe');
    frame.className = 'vcard__video';
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    frame.title = 'Bob Hulse: Learning for a Living';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    card.appendChild(frame);
    card.classList.add('is-playing');
  });
  initStrip({ folders: 'next-folders', pager: 'next-pager', pages: Array.from({ length: 3 }, () => posts.slice(0, 3).map(postCard)) });
}

bootPage(initVideo);
