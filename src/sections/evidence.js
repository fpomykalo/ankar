import { gsap } from '../lib/scroll.js';

/**
 * "The R&D challenge" stage (pinned 40px under the navigation).
 * As you scroll: headline + body copy fade out, the eyebrow crossfades to
 * "Supporting evidence", the Insight callout rotates 90° counter-clockwise
 * while its tab (with the label) slides up into place, the whole thing grows
 * into the "2x" card and the "40%" card slides in from the right, above it.
 */
export function initEvidence() {
  const stage = document.getElementById('challenge-stage');
  const callout = document.getElementById('callout');
  const morph = document.getElementById('ecard-morph');
  const cards = document.getElementById('evidence-cards');
  const card1 = document.getElementById('ecard-1');
  const card2 = document.getElementById('ecard-2');
  const body = document.getElementById('challenge-body');
  const title = stage.querySelector('.sec__title');
  const eb1 = document.getElementById('challenge-eb1');
  const eb1m = document.getElementById('challenge-eb1-muted');
  const eb2 = document.getElementById('challenge-eb2');
  if (!stage || !callout || !morph) return;

  // the callout text rides along and fades during the first part of the turn
  const text = callout.querySelector('.callout__text').cloneNode(true);
  morph.appendChild(text);
  const w1 = morph.querySelector('.ecard-morph__w1');
  const w2 = morph.querySelector('.ecard-morph__w2');

  const bg1 = card1.querySelector('.ecard__bg');
  const content1 = card1.querySelector('.ecard__content');

  // callout and card slot share the same top (294px under the rule): no offset, no jump
  gsap.set(morph, { left: 25, top: callout.offsetTop - cards.offsetTop, width: 505, height: 118, rotation: 0, '--tab-left': '58px' });
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
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        const active = st.progress > 0.001 && st.progress < 0.999;
        callout.style.visibility = st.progress > 0.001 ? 'hidden' : '';
        morph.style.visibility = active ? 'visible' : 'hidden';
        bg1.style.visibility = st.progress >= 0.999 ? '' : 'hidden';
      },
    },
  });

  tl.to([body, title], { opacity: 0, y: -30, duration: 0.25, ease: 'power2.in' }, 0)
    .to(text, { opacity: 0, duration: 0.2 }, 0)
    .to(eb1, { opacity: 0, duration: 0.25 }, 0.05)
    .to(eb1m, { opacity: 1, duration: 0.25 }, 0.05)
    .to(eb2, { opacity: 1, duration: 0.3 }, 0.15)
    .to(w1, { opacity: 0, duration: 0.2 }, 0.3)
    .to(w2, { opacity: 1, duration: 0.2 }, 0.4)
    .to(cards, { top: 58, duration: 1, ease: 'power1.inOut' }, 0)   // the whole slot rides up as the headline leaves
    .to(morph, {
      left: 0, top: 580, width: 580, height: 665, rotation: -90, '--tab-left': '342px',
      duration: 1, ease: 'power1.inOut',
    }, 0)
    .to(content1, { opacity: 1, duration: 0.3 }, 0.7)
    .to(card2, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.35);

  [card1, card2].forEach((card) => {
    card.addEventListener('mouseenter', () => {
      [card1, card2].forEach((c) => c.classList.toggle('is-active', c === card));
    });
  });
}
