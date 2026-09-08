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

  // --- dropdown -------------------------------------------------------------
  let openTl;
  const open = () => {
    nav.classList.add('is-open');
    openTl?.kill();
    openTl = gsap.to(nav, { height: 410, duration: 0.55, ease: 'power3.out' });
  };
  const close = () => {
    nav.classList.remove('is-open');
    openTl?.kill();
    openTl = gsap.to(nav, { height: 60, duration: 0.45, ease: 'power3.inOut' });
  };
  let leaveTimer;
  nav.addEventListener('mouseenter', () => { clearTimeout(leaveTimer); open(); });
  nav.addEventListener('mouseleave', () => { leaveTimer = setTimeout(close, 120); });
}
