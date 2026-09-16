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
    if (hold) { releaseSpace(); gsap.set(section, { paddingBottom: 0 }); }
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
    const y = window.scrollY + by; // the real position: Lenis's own value can lag behind native scrolling on the phone
    lenis.animatedScroll = y;
    lenis.targetScroll = y;
    if (a?.isRunning) { a.value += by; a.from += by; a.to += by; }
    window.scrollTo(0, y);
    debugLog(`fold shift ${by} -> ${y}`);
  }
  // ?debug shows the watch's view of things on the phone
  const debugEl = /[?&]debug/.test(location.search) ? Object.assign(document.body.appendChild(document.createElement('pre')), { style: 'position:fixed;left:0;bottom:0;z-index:99999;margin:0;padding:6px 8px;font:11px/14px monospace;background:rgba(0,0,0,.75);color:#0f0;pointer-events:none;white-space:pre-wrap;max-width:100%' }) : null;
  const debugLines = [];
  function debugLog(line) { if (!debugEl) return; debugLines.push(line); if (debugLines.length > 4) debugLines.shift(); }
  function debugShow(state) { if (debugEl) debugEl.textContent = `${state}\n${debugLines.join('\n')}`; }

  function finishClose() {
    gsap.set(takeover, { visibility: 'hidden' });
    gsap.set(card(), { visibility: 'visible' });
    takeover.setAttribute('aria-hidden', 'true');
    folders.style.pointerEvents = '';
    open = false;
    stopWatch();
    if (mobile) refreshAtRest(); else ScrollTrigger.refresh(); // the page is shorter now: the triggers below move up with it
  }

  // ScrollTrigger.refresh() puts the scroll position back where it measured it (a scrollTo), and on the phone any
  // scrollTo stops the native momentum scroll dead. So the phone refreshes only once the scroll has rested.
  let restTimer = 0;
  function refreshAtRest() {
    clearInterval(restTimer);
    let last = -1;
    let same = 0;
    restTimer = setInterval(() => {
      const y = Math.round(window.scrollY);
      same = y === last ? same + 1 : 0;
      last = y;
      if (same < 2) return;
      clearInterval(restTimer);
      restTimer = 0;
      ScrollTrigger.refresh();
      debugLog(`refresh at rest y ${y}`);
    }, 150);
  }

  // Out of view, the take-over folds away in one frame. Below the viewport only the space under the fold gives way.
  // Above it the section would give back `extra` pixels above what is on screen, which needs the scroll shifted by
  // the same amount in the same frame. On the desktop Lenis carries that shift (its running animation moves with
  // it). On the phone a scrollTo kills the native momentum scroll dead, so there the section keeps its extra space
  // for the moment and hands it back once the scroll rests, or once the space is below the screen, where nothing
  // moves; only a thumb heading back up towards it gets the shift while still moving.
  function foldAway(above) {
    tl.pause(0);
    tl.kill();
    tl = null;
    if (mobile) {
      gsap.set(section, { paddingBottom: extra }); // the timeline's rewind took it away: keep the space until it can go
      finishClose();
      holdSpace();
      return;
    }
    if (above) shiftScroll(-extra);
    finishClose();
  }
  let hold = 0;
  function releaseSpace() { clearInterval(hold); hold = 0; }
  function holdSpace() {
    releaseSpace();
    let ly = -1;
    let st = 0;
    hold = setInterval(() => {
      const b = section.getBoundingClientRect().bottom; // the space is the section's bottom padding
      const y = Math.round(window.scrollY);
      const prev = ly;
      st = y === ly ? st + 1 : 0;
      ly = y;
      const give = (why, shift) => {
        releaseSpace();
        gsap.set(section, { paddingBottom: 0 });
        if (shift) shiftScroll(-extra);
        debugLog(`space back (${why}) at y ${y}`);
        debugShow(`space back (${why})`);
        refreshAtRest();
      };
      debugShow(`holding space ${extra} bottom:${Math.round(b)} vh:${vh()} y:${y} still:${st}`);
      if (b - extra >= vh()) give('below', false); // the space is under the screen: nothing on screen moves
      else if (b <= 0 && st >= 2) give('rest', true); // above the screen, scroll at rest: the shift lands unseen
      else if (prev >= 0 && y < prev && b > -200) give('near', true); // heading back up towards it: shift now rather than show blank space
    }, 120);
  }
  // While open, a 120ms watch folds the take-over once it is fully out of view. The phone folds at once (the space
  // stays for now, see foldAway). The desktop shifts the scroll, so above the screen it waits for the scroll to rest
  // (two ticks within 2px) or for 1.5s out of view, when a trackpad flick will have paused for a frame anyway.
  let watch = 0;
  let lastY = -1;
  let still = 0;
  let outSince = 0;
  function stopWatch() { clearInterval(watch); watch = 0; still = 0; lastY = -1; outSince = 0; }
  function startWatch() {
    stopWatch();
    watch = setInterval(() => {
      if (!open || !tl || tl.reversed() || tl.progress() < 1) { debugShow(`waiting open:${open} tl:${tl ? tl.progress().toFixed(2) : 'none'} rev:${tl ? tl.reversed() : '-'}`); return; }
      const r = takeover.getBoundingClientRect();
      const above = r.bottom <= 0;
      const out = r.top >= vh() || above;
      const y = Math.round(window.scrollY);
      still = out && Math.abs(y - lastY) <= 2 ? still + 1 : 0;
      lastY = y;
      if (out && !outSince) outSince = performance.now();
      if (!out) outSince = 0;
      const outFor = outSince ? Math.round(performance.now() - outSince) : 0;
      debugShow(`open:${open} tl:${tl.progress().toFixed(2)} top:${Math.round(r.top)} bottom:${Math.round(r.bottom)} vh:${vh()} y:${y} still:${still} out:${out} outFor:${outFor}`);
      if (!out) return;
      if (mobile || !above || still >= 2 || outFor >= 1500) { debugLog(`fold ${above ? 'above' : 'below'} at y ${y} (${mobile ? 'phone' : still >= 2 ? 'rest' : !above ? 'below' : 'timeout'})`); foldAway(above); }
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
