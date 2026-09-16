import { gsap, lenis, ScrollTrigger, anchorTargets } from '../lib/scroll.js';
import { isMobile } from '../lib/mobile.js';

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
  // the other cards and the card's own chrome fade; the section head above stays visible,
  // so scrolling up from the take-over reads as one section and nothing pops in at the fold
  const fadeEls = () => [
    ...cards().slice(1),
    ...card().querySelectorAll('.fcard__ui, .fcard__grad, .fcard__grad-bottom'),
  ];
  // phone (Figma "Group 348", 393 × 900): the photo fills the top 345px, the blue folder slides up under it
  const mobile = isMobile();
  const vw = () => (mobile ? document.documentElement.clientWidth : Math.max(document.documentElement.clientWidth, 1440));
  const vh = () => window.innerHeight;
  const PHOTO_W = 786 / 1440; // Figma: the photo covers the left 786px of a 1440 viewport
  const CARDS_H = 480;
  const M_H = 900;
  const M_PHOTO_H = 405; // Figma 345 plus 60 under the blue panel, so the two curves meet
  const M_PANEL_H = 623;
  const NAV_LOCK = mobile ? 96 : 120; // the carousel comes back 40px under the nav
  const label = panel.querySelector('.ls__label');
  if (mobile) { panel.classList.add('folder--top'); takeover.appendChild(label); } // the label sits 30px from the edge, outside the folder mask
  const panelParts = () => (mobile ? [panel, label] : [panel]);
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
    const H = mobile ? M_H : vh();
    extra = H - (mobile ? folders.offsetHeight : CARDS_H);
    gsap.set(takeover, { top, height: H, visibility: 'visible' });
    if (mobile) folders.scrollTo({ left: 0, behavior: 'instant' }); // the photo grows out of the first card
    const r = card().getBoundingClientRect();
    const o = takeover.getBoundingClientRect();
    gsap.set(photo, { left: r.left - o.left, top: r.top - o.top, width: mobile ? r.width : 557, height: r.height, '--tab-top': mobile ? '238px' : '58px', visibility: 'hidden' });
    gsap.set(brand, { opacity: 0 });
    if (mobile) gsap.set(panelParts(), { x: 0, y: M_PANEL_H + 40 }); else gsap.set(panel, { x: vw() * 0.51 + 40 });
    gsap.set(copy, { y: 40, opacity: 0 });
    startWatch();

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
      .to(photo, mobile ? { left: 0, top: 0, width: () => vw(), height: M_PHOTO_H, duration: DUR, ease: 'power2.inOut' } : { left: -55, top: 0, width: () => vw() * PHOTO_W + 55, height: () => vh(), duration: DUR, ease: 'power2.inOut' }, 0.3)
      .to(brand, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.72)
      .to(panelParts(), { x: 0, y: 0, duration: 0.65, ease: 'power3.inOut' }, 0.55)
      .to(copy, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out' }, 1.1);
  }

  // Move the scroll position by `by` in the same frame as the section shrinks, so nothing on screen moves.
  // Lenis's current value, target and running animation all shift together, so momentum is kept.
  function shiftScroll(by) {
    const a = lenis.animate;
    lenis.animatedScroll += by;
    lenis.targetScroll += by;
    if (a?.isRunning) { a.value += by; a.from += by; a.to += by; }
    window.scrollTo(0, lenis.animatedScroll);
  }

  function finishClose() {
    gsap.set(takeover, { visibility: 'hidden' });
    gsap.set(card(), { visibility: 'visible' });
    takeover.setAttribute('aria-hidden', 'true');
    folders.style.pointerEvents = '';
    open = false;
    stopWatch();
    ScrollTrigger.refresh(); // the page is shorter now: the triggers below move up with it (about 1ms)
  }

  // Out of view: reset everything in one frame. Below the viewport only the space under the fold gives way.
  // Above it, the section gives back `extra` pixels above what is on screen, so the scroll moves up by the
  // same amount in the same frame; that shift only lands cleanly on a resting scroll (trackpad and touch
  // momentum ignore a scrollTo mid-flight, which showed as a jump), so the watch below waits for it to stop.
  function foldAway(above) {
    tl.pause(0);
    tl.kill();
    tl = null;
    if (above) shiftScroll(-extra);
    finishClose();
  }
  // While open, a 120ms watch folds it once it is fully out of view and the scroll position has held still twice
  // in a row: no event plumbing to miss, and the compensating shift lands on a resting scroll.
  let watch = 0;
  let lastY = -1;
  let still = 0;
  function stopWatch() { clearInterval(watch); watch = 0; still = 0; lastY = -1; }
  function startWatch() {
    stopWatch();
    watch = setInterval(() => {
      if (!open || !tl || tl.reversed() || tl.progress() < 1) return;
      const r = takeover.getBoundingClientRect();
      const out = r.top >= vh() || r.bottom <= 0;
      const y = Math.round(window.scrollY);
      still = out && y === lastY ? still + 1 : 0;
      lastY = y;
      if (out && still >= 2) foldAway(r.bottom <= 0);
    }, 120);
  }

  function closeTakeover() {
    if (!open || !tl || tl.reversed()) return;
    const r = takeover.getBoundingClientRect();
    if (r.top >= vh() || r.bottom <= 0) return; // out of view: the watch folds it once the scroll rests
    // in view: bring the carousel back to its lock under the nav while the space closes
    lenis.scrollTo(sectionTop() + cardsTop() - NAV_LOCK, { duration: DUR + 0.3, lock: true, force: true });
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
    if (e.target.closest('.ls__cta') || e.target.closest('#nav')) return; // the story button, or the menu card that just opened it
    closeTakeover();
  });
  // #antheros (the case study card in the menu): the story opens and fills the viewport
  anchorTargets.antheros = () => { openTakeover(); return sectionTop() + cardsTop(); };
  if (location.hash === '#antheros') {
    const land = () => { lenis.scrollTo(sectionTop() + cardsTop(), { immediate: true, force: true }); openTakeover(); };
    if (document.readyState === 'complete') setTimeout(land, 400); else window.addEventListener('load', () => setTimeout(land, 400), { once: true });
  }
}
