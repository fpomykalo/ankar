import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and scroll stay in sync.
export const lenis = new Lenis({
  lerp: 0.09,
  wheelMultiplier: 1,
  smoothWheel: true,
  autoRaf: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Named scroll positions registered by the pinned scenes (e.g. anchorTargets.possible = () => y),
// so an anchor can land inside a scrubbed stage instead of at an element's top.
export const anchorTargets = {};

// in-page anchors go through Lenis
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const raw = a.getAttribute('href');
  if (raw === '#') { e.preventDefault(); return; } // placeholder links stay put instead of jumping to the top
  if (!raw.includes('#')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname) return; // another page: let the browser go there
  const href = url.hash;
  if (href.length < 2) { e.preventDefault(); return; }
  const named = anchorTargets[href.slice(1)];
  let target = named ? named() : document.querySelector(href);
  if (target == null) return;
  e.preventDefault();
  // a pinned stage reports the viewport top as its position while it is pinned, so aim at its trigger's start instead
  const pinned = target instanceof Element && ScrollTrigger.getAll().find((t) => t.pin === target);
  if (pinned) target = pinned.start;
  const offset = Number(a.dataset.offset || 0); // positive values land the section's content 120px under the top, like the pinned scenes
  lenis.scrollTo(target, { offset, duration: 1.4, force: true, lock: true });
});

export { gsap, ScrollTrigger };
