import { gsap, ScrollTrigger } from '../lib/scroll.js';

/** Closing CTA: the product mock grows from 880px to 1280px wide while
 *  scrolling; the section then stays put while the footer slides up over it. */
export function initClosing() {
  const closing = document.getElementById('closing');
  const mock = document.getElementById('closing-mock');
  if (!closing || !mock) return;

  gsap.to(mock, {
    scale: 1000 / 880, // grows from 880px to 1000px wide
    ease: 'none',
    scrollTrigger: { trigger: mock, start: 'top 95%', end: 'top 25%', scrub: 0.5 },
  });

  const stick = () => {
    closing.style.position = 'sticky';
    closing.style.top = `${window.innerHeight - closing.offsetHeight}px`;
  };
  stick();
  ScrollTrigger.addEventListener('refreshInit', stick);

  // customer story video: click to play / pause
  const box = document.getElementById('video-box');
  if (box) {
    const v = box.querySelector('video');
    box.addEventListener('click', () => {
      if (v.paused) { v.play(); box.classList.add('is-playing'); } else { v.pause(); box.classList.remove('is-playing'); }
    });
  }
}
