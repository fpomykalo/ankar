import { gsap, ScrollTrigger } from '../lib/scroll.js';

/** Closing CTA: the product mock grows from 880px to 1000px wide while
 *  scrolling; the "Explore the platform" button locks 40px under the
 *  navigation; the section then holds while the footer slides up over it. */
export function initClosing() {
  const closing = document.getElementById('closing');
  const mock = document.getElementById('closing-mock');
  const ctaWrap = document.getElementById('closing-cta-wrap');
  if (!closing || !mock) return;

  gsap.to(mock, {
    scale: 1000 / 880,
    ease: 'none',
    scrollTrigger: { trigger: mock, start: 'top 95%', end: 'top 25%', scrub: 0.5 },
  });

  const stick = () => {
    closing.style.position = 'sticky';
    closing.style.top = `${window.innerHeight - closing.offsetHeight}px`;
  };
  stick();
  ScrollTrigger.addEventListener('refreshInit', stick);

  // keep the CTA 40px under the nav (nav bottom = 80px) once it would scroll past
  const LOCK = 120;
  gsap.ticker.add(() => {
    const natural = ctaWrap.getBoundingClientRect().top - (Number(gsap.getProperty(ctaWrap, 'y')) || 0);
    gsap.set(ctaWrap, { y: Math.max(0, LOCK - natural) });
  });

  const box = document.getElementById('video-box');
  if (box) {
    const v = box.querySelector('video');
    box.addEventListener('click', () => {
      if (v.paused) { v.play(); box.classList.add('is-playing'); } else { v.pause(); box.classList.remove('is-playing'); }
    });
  }
}
