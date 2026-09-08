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
  const fadeEls = () => [
    ...stage.querySelectorAll('[data-ind-fade]'),
    ...Array.from(folders.children).slice(1),
    ...card().querySelectorAll('.fcard__open, .fcard__closed, .tab-label, .fcard__line, .fcard__grad, .fcard__grad-bottom'),
  ];
  const H = () => stage.clientHeight;
  const W = () => stage.clientWidth;
  const HOLD = () => Math.round(window.innerHeight * 0.25);
  const DUR = 1400;
  const rect = () => {
    const r = card().getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height };
  };

  gsap.set(panel, { x: () => W() + 40 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: () => `+=${HOLD() + DUR}`, pin: true, scrub: 0.7, invalidateOnRefresh: true,
      onUpdate: (st) => {
        const past = st.progress * (HOLD() + DUR) > HOLD();
        photo.style.visibility = past ? 'visible' : 'hidden';
        card().style.visibility = past ? 'hidden' : '';
      },
    },
  });
  const t0 = HOLD();
  tl.to(fadeEls(), { opacity: 0, duration: 260, ease: 'power2.in' }, t0)
    .fromTo(photo, {
      left: () => rect().left, top: () => rect().top, width: () => rect().width, height: () => rect().height, '--tab-top': '58px',
    }, {
      left: -55, top: 0, width: () => W() * 0.6 + 55, height: () => H(), duration: 700, ease: 'power2.inOut', immediateRender: false,
    }, t0)
    .to(brand, { opacity: 1, duration: 260, ease: 'power2.out' }, t0 + 420)
    .to(panel, { x: 0, duration: 650, ease: 'power3.inOut' }, t0 + 250)
    .to(copy, { y: 0, opacity: 1, duration: 300, stagger: 50, ease: 'power3.out' }, t0 + 850)
    .to({}, { duration: 1 }, t0 + DUR - 1);
}
