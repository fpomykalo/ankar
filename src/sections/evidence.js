import { gsap, ScrollTrigger } from '../lib/scroll.js';

/**
 * "The R&D challenge" stage (pinned).
 * The rule, eyebrow and headline stay put. As you scroll:
 *   - the body copy and the callout text fade away
 *   - "The R&D challenge" eyebrow dims and "Supporting evidence" fades in
 *   - the Insight callout rotates 90° counter-clockwise, its tab slides up
 *     and it grows into the "2x" card; the "40%" card slides in from the right
 * Then the stage releases and scrolls on.
 */
export function initEvidence() {
  const stage = document.getElementById('challenge-stage');
  const callout = document.getElementById('callout');
  const morph = document.getElementById('ecard-morph');
  const cards = document.getElementById('evidence-cards');
  const card1 = document.getElementById('ecard-1');
  const card2 = document.getElementById('ecard-2');
  const body = document.getElementById('challenge-body');
  const eb1 = document.getElementById('challenge-eb1');
  const eb1m = document.getElementById('challenge-eb1-muted');
  const eb2 = document.getElementById('challenge-eb2');
  if (!stage || !callout || !morph) return;

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
      trigger: stage,
      start: 'top top',
      end: '+=900',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        const active = st.progress > 0.001 && st.progress < 0.999;
        callout.style.visibility = st.progress > 0.001 ? 'hidden' : '';
        morph.style.visibility = active ? 'visible' : 'hidden';
        bg1.style.visibility = st.progress >= 0.999 ? '' : 'hidden';
      },
    },
  });

  tl.to(body, { opacity: 0, y: -30, duration: 0.25, ease: 'power2.in' }, 0)
    .to([label, text], { opacity: 0, duration: 0.22 }, 0)
    .to(eb1, { opacity: 0, duration: 0.25 }, 0.05)
    .to(eb1m, { opacity: 1, duration: 0.25 }, 0.05)
    .to(eb2, { opacity: 1, duration: 0.3 }, 0.15)
    .to(morph, {
      left: 0, top: 580, width: 580, height: 665, rotation: -90, '--tab-left': '342px',
      duration: 1, ease: 'power1.inOut',
    }, 0)
    .to(content1, { opacity: 1, duration: 0.3 }, 0.7)
    .to(card2, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.35);

  // active state: red + white ink; the card hovered last stays active
  [card1, card2].forEach((card) => {
    card.addEventListener('mouseenter', () => {
      [card1, card2].forEach((c) => c.classList.toggle('is-active', c === card));
    });
  });

  ScrollTrigger.addEventListener('refreshInit', () => gsap.set(morph, { top: startTop }));
}
