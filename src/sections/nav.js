import { gsap } from '../lib/scroll.js';

/**
 * Fixed navigation.
 * - Logo links home (respects the deploy base path).
 * - Ink stays black over every surface.
 * - Hover opens the mega-menu (Figma "Nav / Variant2": 1280 × 468).
 */
export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.querySelector('.nav__logo').setAttribute('href', import.meta.env.BASE_URL || '/');

  // --- dropdowns ------------------------------------------------------------
  // Product / Careers / Security / Resources open the mega-menu on hover.
  // Home opens the small anchor list on hover (or click); the two never show together.
  const home = document.getElementById('nav-home');
  const homeWrap = document.getElementById('nav-home-wrap');
  let openTl;
  const openMega = () => {
    closeHome();
    nav.classList.add('is-open');
    openTl?.kill();
    openTl = gsap.to(nav, { height: 468, duration: 0.55, ease: 'power3.out' });
  };
  const closeMega = () => {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    openTl?.kill();
    openTl = gsap.to(nav, { height: 60, duration: 0.45, ease: 'power3.inOut' });
  };
  const openHome = () => {
    closeMega();
    nav.classList.add('is-home');
    homeWrap.classList.add('is-open');
    home.setAttribute('aria-expanded', 'true');
  };
  const closeHome = () => {
    nav.classList.remove('is-home');
    homeWrap.classList.remove('is-open');
    home.setAttribute('aria-expanded', 'false');
  };
  const closeAll = () => { closeMega(); closeHome(); };

  let leaveTimer;
  const hold = () => clearTimeout(leaveTimer);
  nav.querySelectorAll('.nav__menu a[data-mega]').forEach((a) => a.addEventListener('mouseenter', () => { hold(); openMega(); }));
  home.addEventListener('mouseenter', () => { hold(); openHome(); });
  home.addEventListener('click', () => (nav.classList.contains('is-home') ? closeHome() : openHome()));
  homeWrap.addEventListener('mouseenter', hold);
  homeWrap.addEventListener('mouseleave', () => { leaveTimer = setTimeout(closeAll, 120); }); // the list is a sibling of the bar, so it needs its own leave
  homeWrap.addEventListener('click', (e) => { if (e.target.closest('a')) closeHome(); }); // picking an anchor folds the list away
  nav.querySelector('.nav__panel').addEventListener('mouseenter', hold);
  // leaving the whole bar closes whichever dropdown is showing
  nav.addEventListener('mouseleave', () => { leaveTimer = setTimeout(closeAll, 120); });
}
