import { bootPage } from '../site.js';
import { posts } from '../data/pages.js';
import { postCard, initStrip } from '../lib/cards.js';

/** The video article: the poster with a play button plays the video once a source is set on the card
 *  (data-src), and Read next shows the same three posts as the blog grid. */
function initVideo() {
  const card = document.getElementById('vcard');
  const play = card?.querySelector('.vcard__play');
  play?.addEventListener('click', () => {
    const src = card.dataset.src;
    if (!src) return; // no video yet: the poster stays
    const video = document.createElement('video');
    video.className = 'vcard__video';
    video.src = src; video.controls = true; video.autoplay = true; video.playsInline = true;
    card.appendChild(video);
    card.classList.add('is-playing');
  });
  initStrip({ folders: 'next-folders', pager: 'next-pager', pages: Array.from({ length: 3 }, () => posts.slice(0, 3).map(postCard)) });
}

bootPage(initVideo);
