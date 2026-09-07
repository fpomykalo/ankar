import { gsap } from '../lib/scroll.js';

/** Customer logo marquee: continuous slow drift inside the masked strip. */
export function initHero() {
  const track = document.getElementById('logo-track');
  if (!track) return;
  const items = Array.from(track.children);
  const loopWidth = track.scrollWidth; // one full cycle: 5 logos + 5 separators + gaps
  for (let i = 0; i < 2; i += 1) items.forEach((n) => track.appendChild(n.cloneNode(true)));
  gsap.to(track, { x: -loopWidth, duration: loopWidth / 38, ease: 'none', repeat: -1 });
}
