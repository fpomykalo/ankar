import { gsap } from './scroll.js';

/**
 * Fade-up reveal ("fade-in-up"): elements start 40px lower and fully
 * transparent, then rise to their resting position while fading to opaque.
 * Elements already in view on load (the hero) play immediately with their
 * per-element delay, which gives the staged entrance.
 */
export function initReveal(root = document) {
  gsap.utils.toArray(root.querySelectorAll('[data-reveal]')).forEach((el) => {
    if (el.closest('[data-skip-reveal]')) { el.removeAttribute('data-reveal'); return; } // stage already in progress (reload)
    const delay = parseFloat(el.dataset.revealDelay || '0');
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay,
      ease: 'power3.out',
      overwrite: 'auto',
      scrollTrigger: { trigger: el, start: el.dataset.revealStart || 'top 90%', once: true },
    });
  });
}

/** Same motion, but for a group of elements driven by code (pinned scenes). */
export function riseIn(targets, opts = {}) {
  return gsap.to(targets, {
    y: 0,
    opacity: 1,
    duration: opts.duration ?? 1,
    stagger: opts.stagger ?? 0.08,
    ease: 'power3.out',
    ...opts,
  });
}
