import { gsap, ScrollTrigger } from '../lib/scroll.js';

/**
 * Challenge → Evidence transition.
 * The "Insight" callout rotates 90° counter-clockwise, its tab slides up the
 * (now vertical) edge, and the shape grows into the "2x" evidence card.
 * The "40%" card slides in from the right. Scroll-scrubbed.
 */
export function initEvidence() {
  const section = document.getElementById('evidence');
  const callout = document.getElementById('callout');
  const morph = document.getElementById('ecard-morph');
  const cards = section.querySelector('.evidence__cards');
  const card1 = document.getElementById('ecard-1');
  const card2 = document.getElementById('ecard-2');
  if (!section || !callout || !morph) return;

  const shape = morph.querySelector('.ecard-morph__shape');
  // copies of the callout text ride along for the first part of the rotation
  const label = callout.querySelector('.callout__label').cloneNode(true);
  const text = callout.querySelector('.callout__text').cloneNode(true);
  morph.append(label, text);

  const bg1 = card1.querySelector('.ecard__bg');
  const content1 = card1.querySelector('.ecard__content');

  const startTop = () => callout.getBoundingClientRect().top - cards.getBoundingClientRect().top;

  gsap.set(morph, { left: 25, top: startTop, width: 505, height: 118, rotation: 0, '--tab-left': '58px' });
  gsap.set(content1, { opacity: 0 });
  gsap.set(card2, { x: 360, opacity: 0 });
  gsap.set(bg1, { visibility: 'hidden' });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top 82%',
      end: 'top 18%',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        const active = st.progress > 0.001 && st.progress < 0.999;
        callout.style.visibility = st.progress > 0.001 ? 'hidden' : '';
        morph.style.visibility = active ? 'visible' : 'hidden';
        bg1.style.visibility = st.progress >= 0.999 ? '' : 'hidden';
      },
    },
  });

  tl.to([label, text], { opacity: 0, duration: 0.22 }, 0)
    .to(morph, {
      left: 0,
      top: 580,
      width: 580,
      height: 665,
      rotation: -90,
      '--tab-left': '342px',
      duration: 1,
      ease: 'power1.inOut',
    }, 0)
    .to(content1, { opacity: 1, duration: 0.3 }, 0.7)
    .to(card2, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.35);

  // active state: red + white ink; the card hovered last stays active
  section.querySelectorAll('.ecard').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      section.querySelectorAll('.ecard').forEach((c) => c.classList.toggle('is-active', c === card));
    });
  });

  ScrollTrigger.addEventListener('refreshInit', () => gsap.set(morph, { top: startTop }));
}
