import { gsap, lenis } from '../lib/scroll.js';

/**
 * The Antheros take-over. The CTA on the Life sciences card opens it: everything
 * else fades, the photo grows out of its card to cover the left of the viewport,
 * the blue folder comes in from the right and its copy rises in. A click anywhere
 * (except the "Watch the Antheros story" button) plays it backwards. It sits in the
 * document at the position it opened, so the page can still be scrolled away from it.
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

  let open = false;
  let tl = null;

  function openTakeover() {
    if (open) return;
    open = true;
    takeover.setAttribute('aria-hidden', 'false');
    cards().forEach((c, i) => c.classList.toggle('is-open', i === 0));
    folders.style.pointerEvents = 'none';

    // the overlay covers the viewport as it is right now, and stays at that spot in the page
    const secTop = section.getBoundingClientRect().top + window.scrollY;
    gsap.set(takeover, { top: window.scrollY - secTop, height: vh(), visibility: 'visible' });
    const r = card().getBoundingClientRect(); // viewport coordinates match the overlay's
    gsap.set(photo, { left: r.left, top: r.top, width: 557, height: r.height, '--tab-top': '58px', visibility: 'hidden' });
    gsap.set(brand, { opacity: 0 });
    gsap.set(panel, { x: vw() * 0.51 + 40 });
    gsap.set(copy, { y: 40, opacity: 0 });

    tl?.kill();
    tl = gsap.timeline({
      onReverseComplete: () => {
        gsap.set(takeover, { visibility: 'hidden' });
        gsap.set(card(), { visibility: 'visible' });
        takeover.setAttribute('aria-hidden', 'true');
        folders.style.pointerEvents = '';
        open = false;
      },
    });
    tl.to(fadeEls(), { opacity: 0, duration: 0.3, ease: 'power2.in' })
      .set(photo, { visibility: 'visible' })
      .set(card(), { visibility: 'hidden' })
      .to(photo, { left: -55, top: 0, width: () => vw() * PHOTO_W + 55, height: () => vh(), duration: 0.7, ease: 'power2.inOut' })
      .to(brand, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.28')
      .to(panel, { x: 0, duration: 0.65, ease: 'power3.inOut' }, '-=0.45')
      .to(copy, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out' }, '-=0.1');
  }

  function closeTakeover() {
    if (!open || !tl) return;
    tl.reverse();
  }

  // the CTA on the Life sciences card
  folders.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-ls-open]');
    if (!cta) return;
    e.preventDefault();
    e.stopPropagation();
    openTakeover();
  });
  // a click anywhere closes it, except on the story button
  document.addEventListener('click', (e) => {
    if (!open || tl?.reversed()) return;
    if (e.target.closest('.ls__cta')) return;
    closeTakeover();
  });
  // scrolled fully out of view: fold it away so the carousel is back when the user returns
  lenis.on('scroll', () => {
    if (!open || tl?.reversed()) return;
    const r = takeover.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh()) tl.progress(0).reverse();
  });
}
