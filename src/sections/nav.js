import { gsap, lenis } from '../lib/scroll.js';
import { isMobile } from '../lib/mobile.js';

/**
 * Fixed navigation.
 * - Logo links home (respects the deploy base path).
 * - Ink stays black over every surface.
 * - Hovering any menu item opens the one mega-menu (1280 × 333): the Home anchors, the Product
 *   workflow groups and the case studies.
 */
export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const base = import.meta.env.BASE_URL || '/';
  const home = document.getElementById('nav-home');
  nav.querySelector('.nav__logo').setAttribute('href', base);
  // the page we are on is underlined in the menu
  nav.querySelectorAll('.nav__menu a[data-mega]:not(.nav__home), .nav__mobile .nav__mlink').forEach((a) => {
    const path = new URL(a.getAttribute('href'), location.href).pathname;
    if (path !== base && location.pathname.startsWith(path)) a.classList.add('is-current');
  });

  // --- phone: the burger grows the bar into the full-screen menu (Figma 7097:8300) ----------
  if (isMobile()) {
    const burger = document.getElementById('nav-burger');
    const list = document.getElementById('nav-mobile');
    let tl;
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
      tl?.kill();
      const vw = document.documentElement.clientWidth;
      tl = gsap.to(nav, open
        ? { left: 0, top: 0, width: vw, height: window.innerHeight, borderRadius: 0, duration: 0.55, ease: 'power3.inOut' }
        : { left: 16, top: 16, width: vw - 32, height: 40, borderRadius: 20, duration: 0.45, ease: 'power3.inOut' });
      if (!open) list.scrollTop = 0;
    };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    list.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    list.querySelector('a').addEventListener('click', (e) => { // Home on the homepage scrolls to the top
      if (location.pathname !== base) return;
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.2, force: true, lock: true });
    });
    window.addEventListener('resize', () => { if (nav.classList.contains('is-open')) gsap.set(nav, { width: document.documentElement.clientWidth, height: window.innerHeight }); });
    return;
  }

  // --- mega-menu ------------------------------------------------------------
  let openTl;
  const openMega = () => {
    nav.classList.add('is-open');
    openTl?.kill();
    openTl = gsap.to(nav, { height: 333, duration: 0.55, ease: 'power3.out' });
  };
  const closeMega = () => {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    openTl?.kill();
    openTl = gsap.to(nav, { height: 60, duration: 0.45, ease: 'power3.inOut' });
  };

  let leaveTimer;
  const hold = () => clearTimeout(leaveTimer);
  // A page that loads with the cursor already over a menu item would open the menu at once
  // (the item you just clicked). Hover-opening is armed half a second after load; a mouse
  // moving over an item after that still opens it, since mouseenter alone won't fire again.
  let armed = false;
  setTimeout(() => { armed = true; }, 500);
  nav.querySelectorAll('.nav__menu a[data-mega]').forEach((a) => {
    const enter = () => { if (!armed) return; hold(); openMega(); };
    a.addEventListener('mouseenter', enter);
    a.addEventListener('mousemove', () => { if (!nav.classList.contains('is-open')) enter(); });
  });
  // Home is a link to the homepage; on the homepage itself it scrolls to the top
  home.addEventListener('click', (e) => {
    if (location.pathname !== base) return;
    e.preventDefault();
    closeMega();
    lenis.scrollTo(0, { duration: 1.2, force: true, lock: true });
  });
  nav.querySelector('.nav__panel').addEventListener('mouseenter', hold);
  nav.querySelector('.nav__panel').addEventListener('click', (e) => { if (e.target.closest('a[href*="#"]')) closeMega(); }); // picking an anchor folds the menu away
  // leaving the bar closes the menu
  nav.addEventListener('mouseleave', () => { leaveTimer = setTimeout(closeMega, 120); });
}
