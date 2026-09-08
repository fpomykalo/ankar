import { gsap } from '../lib/scroll.js';

/**
 * Pinned scene: the life-sciences photo grows to take over the left of the
 * viewport, the blue folder panel slides in from the right, then the copy rises.
 */
export function initLifeSciences() {
  const stage = document.getElementById('ls-stage');
  const photo = document.getElementById('ls-photo');
  const panel = document.getElementById('ls-panel');
  if (!stage) return;
  const copy = panel.querySelectorAll('[data-ls]');
  const H = () => stage.clientHeight;

  gsap.set(photo, { left: 55, top: () => (H() - 480) / 2, width: 557, height: 480, borderRadius: 30 });
  // the blue folder starts on the left (where the industry card's folder was) and travels to the right half
  gsap.set(panel, { x: -632, opacity: 0 });

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: '+=1500',
      pin: true,
      scrub: 0.7,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
    .to(photo, { left: 0, top: 0, width: 786, height: () => H(), borderRadius: 0, duration: 0.5, ease: 'power2.inOut' }, 0)
    .to(panel, { opacity: 1, duration: 0.12 }, 0.12)
    .to(panel, { x: 0, duration: 0.5, ease: 'power3.inOut' }, 0.18)
    .to(copy, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out' }, 0.55);
}
