import { gsap } from '../lib/scroll.js';

/**
 * "Built for consequential R&D" locks 40px under the navigation. After a
 * quarter viewport of scroll everything fades except the life-sciences photo,
 * which stretches out of its card to cover the left 60% of the viewport (the
 * Antheros mark appears on it), while the blue folder comes in from the right
 * and settles on the right half, then its copy rises in.
 */
export function initLifeSciences() {
  const stage = document.getElementById('industries-stage');
  const photo = document.getElementById('ls-photo');
  const panel = document.getElementById('ls-panel');
  const folders = document.getElementById('industries-folders');
  if (!stage || !photo) return;
  const brand = photo.querySelector('.ls__brand');
  const copy = panel.querySelectorAll('[data-ls]');
  const card = () => folders.querySelector('.fcard');
  const cards = () => Array.from(folders.children);
  const fadeEls = () => [
    ...stage.querySelectorAll('[data-ind-fade]'),
    ...cards().slice(1),
    ...card().querySelectorAll('.fcard__open, .fcard__closed, .tab-label, .fcard__line, .fcard__grad, .fcard__grad-bottom'),
  ];
  // whichever card is active, the take-over first hands the highlight to Life sciences
  const OPEN_W = 557;
  const SETTLE = 260;
  let taking = false;
  const setTaking = (on) => {
    if (on === taking) return;
    taking = on;
    folders.style.pointerEvents = on ? 'none' : '';
    if (on) cards().forEach((c, i) => c.classList.toggle('is-open', i === 0));
  };
  const H = () => stage.clientHeight;
  const W = () => stage.clientWidth;
  const HOLD = () => Math.round(window.innerHeight * 0.25);
  const DUR = 1400 + 260;
  // geometry of the Life sciences card in its open state (layout offsets, no transforms)
  const rect = () => {
    const container = folders.offsetParent;
    return {
      left: container.offsetLeft + folders.offsetLeft,
      top: container.offsetTop + folders.offsetTop,
      width: OPEN_W,
      height: card().offsetHeight || 480,
    };
  };

  gsap.set(panel, { x: () => W() + 40 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: () => `+=${HOLD() + DUR}`, pin: true, scrub: 0.7, invalidateOnRefresh: true,
      onUpdate: (st) => setTaking(st.progress * (HOLD() + DUR) > HOLD()),
    },
  });
  const t0 = HOLD();
  // the photo layer starts exactly on the card and only swaps in when the take-over begins
  gsap.set(photo, { left: () => rect().left, top: () => rect().top, width: () => rect().width, height: () => rect().height, '--tab-top': '58px' });
  // 1. everything else fades while Life sciences takes the highlight (its card widens, colour returns)
  tl.to(fadeEls(), { opacity: 0, duration: SETTLE, ease: 'power2.in' }, t0);
  // 2. the photo layer swaps in on the open card and grows to the left 60%
  const t1 = t0 + SETTLE;
  tl.set(photo, { visibility: 'visible' }, t1)
    .set(card(), { visibility: 'hidden' }, t1)
    .to(photo, {
      left: -55, top: 0, width: () => W() * 0.6 + 55, height: () => H(), duration: 700, ease: 'power2.inOut',
    }, t1)
    .to(brand, { opacity: 1, duration: 260, ease: 'power2.out' }, t1 + 420)
    .to(panel, { x: 0, duration: 650, ease: 'power3.inOut' }, t1 + 250)
    .to(copy, { y: 0, opacity: 1, duration: 300, stagger: 50, ease: 'power3.out' }, t1 + 850)
    .to({}, { duration: 1 }, t0 + DUR - 1);
}
