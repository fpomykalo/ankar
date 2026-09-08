import { gsap, lenis } from '../lib/scroll.js';

/**
 * Fixed navigation.
 * - Logo links home (respects the deploy base path).
 * - Theme: white ink over dark surfaces ([data-nav-dark] elements under the
 *   nav's centre line), black ink over light surfaces.
 * - Hover opens the mega-menu (Figma "Nav / Variant2": 1280 × 410).
 */
export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.querySelector('.nav__logo').setAttribute('href', import.meta.env.BASE_URL || '/');

  // --- light / dark ---------------------------------------------------------
  const darkZones = Array.from(document.querySelectorAll('[data-nav-dark]'));
  const probeY = 50;   // nav centre line
  const probeX = () => window.innerWidth / 2;
  let dark = null;
  function updateTheme() {
    const x = probeX();
    const isDark = darkZones.some((el) => {
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
      const r = el.getBoundingClientRect();
      return r.top <= probeY && r.bottom >= probeY && r.left <= x && r.right >= x && getComputedStyle(el).visibility !== 'hidden';
    });
    if (isDark !== dark) { dark = isDark; nav.classList.toggle('nav--dark', isDark); }
  }
  lenis.on('scroll', updateTheme);
  gsap.ticker.add(updateTheme);

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
    openTl = gsap.to(nav, { height: 410, duration: 0.55, ease: 'power3.out' });
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
