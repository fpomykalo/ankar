import { gsap } from '../lib/scroll.js';

/**
 * Pinned scene: the life-sciences photo (same image as the industry card)
 * grows to fill the left half of the viewport with the Antheros mark on it,
 * while the blue folder comes in from the left and settles on the right half.
 */
export function initLifeSciences() {
  const stage = document.getElementById('ls-stage');
  const photo = document.getElementById('ls-photo');
  const panel = document.getElementById('ls-panel');
  const brand = photo.querySelector('.ls__brand');
  if (!stage) return;
  const copy = panel.querySelectorAll('[data-ls]');
  const H = () => stage.clientHeight;
  const W = () => stage.clientWidth;

  gsap.set(photo, { left: 55, top: () => (H() - 480) / 2, width: 557, height: 480, borderRadius: 30 });
  gsap.set(brand, { opacity: 0, y: 20 });
  gsap.set(panel, { x: () => -W() });

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: '+=1600', pin: true, scrub: 0.7, invalidateOnRefresh: true,
    },
  })
    .to(photo, { left: 0, top: 0, width: () => W() / 2, height: () => H(), borderRadius: 0, duration: 0.45, ease: 'power2.inOut' }, 0)
    .to(brand, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.3)
    .to(panel, { x: 0, duration: 0.5, ease: 'power3.inOut' }, 0.35)
    .to(copy, { y: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: 'power3.out' }, 0.72);
}
