import { gsap, lenis, ScrollTrigger } from '../lib/scroll.js';

/**
 * The Antheros take-over, opened by the CTA on the Life sciences card.
 * It lives in the page flow: the section grows by a viewport's worth (pushing
 * everything below it down) while the page eases so the carousel area fills
 * the viewport, and the photo grows out of its card as the blue folder comes
 * in from the right. A click anywhere (except the story button) plays it
 * backwards and hands the space back. Scroll it fully out of view and it folds
 * itself away, so the carousel is back when you return.
 */
export function initLifeSciences() {
  const section = document.getElementById('industries');
  const takeover = document.getElementById('ls-takeover');
  const photo = document.getElementById('ls-photo');
  const panel = document.getElementById('ls-panel');
  const folders = document.getElementById('industries-folders');
  if (!section || !takeover || !folders) return;
  const brand = photo.querySelector('.ls__brand');
  const copy = panel.querySelectorAll('[data-ls]');
  const cards = () => Array.from(folders.children);
  const card = () => cards()[0];
  const fadeEls = () => [
    document.getElementById('industries-fade'),
    ...cards().slice(1),
    ...card().querySelectorAll('.fcard__ui, .fcard__grad, .fcard__grad-bottom'),
  ];
  const vw = () => Math.max(document.documentElement.clientWidth, 1440);
  const vh = () => window.innerHeight;
  const PHOTO_W = 786 / 1440; // Figma: the photo covers the left 786px of a 1440 viewport
  const CARDS_H = 480;
  const DUR = 0.7;

  let open = false;
  let tl = null;
  let extra = 0; // how much the section grew

  const sectionTop = () => section.getBoundingClientRect().top + window.scrollY;
  const cardsTop = () => folders.getBoundingClientRect().top + window.scrollY - sectionTop(); // within the section

  function openTakeover() {
    if (open) return;
    open = true;
    takeover.setAttribute('aria-hidden', 'false');
    cards().forEach((c, i) => c.classList.toggle('is-open', i === 0));
    folders.style.pointerEvents = 'none';

    // the take-over starts at the carousel's top and is one viewport tall
    const top = cardsTop();
    extra = vh() - CARDS_H;
    gsap.set(takeover, { top, height: vh(), visibility: 'visible' });
    const r = card().getBoundingClientRect();
    const o = takeover.getBoundingClientRect();
    gsap.set(photo, { left: r.left - o.left, top: r.top - o.top, width: 557, height: r.height, '--tab-top': '58px', visibility: 'hidden' });
    gsap.set(brand, { opacity: 0 });
    gsap.set(panel, { x: vw() * 0.51 + 40 });
    gsap.set(copy, { y: 40, opacity: 0 });

    // the page eases so the take-over fills the viewport while the section makes room below
    lenis.scrollTo(sectionTop() + top, { duration: DUR + 0.3, lock: true, force: true });
    tl?.kill();
    tl = gsap.timeline({
      onComplete: () => ScrollTrigger.refresh(),
      onReverseComplete: finishClose,
    });
    tl.to(section, { paddingBottom: extra, duration: DUR + 0.3, ease: 'power2.inOut' }, 0)
      .to(fadeEls(), { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
      .set(photo, { visibility: 'visible' }, 0.3)
      .set(card(), { visibility: 'hidden' }, 0.3)
      .to(photo, { left: -55, top: 0, width: () => vw() * PHOTO_W + 55, height: () => vh(), duration: DUR, ease: 'power2.inOut' }, 0.3)
      .to(brand, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.72)
      .to(panel, { x: 0, duration: 0.65, ease: 'power3.inOut' }, 0.55)
      .to(copy, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out' }, 1.1);
  }

  function finishClose() {
    gsap.set(takeover, { visibility: 'hidden' });
    gsap.set(card(), { visibility: 'visible' });
    takeover.setAttribute('aria-hidden', 'true');
    folders.style.pointerEvents = '';
    open = false;
    ScrollTrigger.refresh();
  }

  // Out of view: reset everything in one frame. When it sits above the viewport the section
  // gives back `extra` pixels above what is on screen, so the scroll moves up by the same
  // amount in the same frame and nothing visible shifts.
  function foldAway() {
    const above = takeover.getBoundingClientRect().bottom <= 0;
    tl.pause(0);
    tl.kill();
    tl = null;
    if (above) {
      const y = window.scrollY - extra;
      window.scrollTo(0, y); // same frame as the section shrinking
      lenis.scrollTo(y, { immediate: true, force: true }); // and Lenis carries on from there
    }
    finishClose();
  }

  function closeTakeover() {
    if (!open || !tl || tl.reversed()) return;
    const r = takeover.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= vh()) { foldAway(); return; }
    // in view: bring the carousel back to its 120px lock while the space closes
    lenis.scrollTo(sectionTop() + cardsTop() - 120, { duration: DUR + 0.3, lock: true, force: true });
    tl.reverse();
  }

  // the CTA on the Life sciences card, or a click anywhere on that card
  folders.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-ls-open]');
    if (!cta && e.target.closest('.fcard') !== card()) return;
    e.preventDefault();
    e.stopPropagation();
    openTakeover();
  });
  // a click anywhere closes it, except on the story button
  document.addEventListener('click', (e) => {
    if (!open) return;
    if (e.target.closest('.ls__cta')) return;
    closeTakeover();
  });
  // fully out of view while open: fold it away so the carousel is back when the viewer returns
  lenis.on('scroll', () => {
    if (!open || !tl || tl.reversed() || tl.progress() < 1) return;
    const r = takeover.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= vh()) foldAway();
  });
}
