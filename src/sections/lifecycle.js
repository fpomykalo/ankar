import { gsap } from '../lib/scroll.js';
import { lifecycle } from '../data/content.js';

/**
 * Four phase cards on a circular carousel.
 * Resting: cards sit flat, 615px apart, centered on the active one.
 * Hover / drag: they fan out on the circle (±10° per step, 72px out, 68px down).
 * Drag with the mouse, horizontal wheel/trackpad, or the arrows.
 */
const STEP = 615;
const FAN_X = 72;
const FAN_Y = 68;
const FAN_ROT = 10;

export function initLifecycle() {
  const wheel = document.getElementById('wheel');
  if (!wheel) return;
  const n = lifecycle.length;

  const cards = lifecycle.map((c) => {
    const el = document.createElement('article');
    el.className = 'wcard folder';
    el.innerHTML = `
      <div class="wcard__bg" style="background:${c.color}"></div>
      <div class="tab-label"><span class="tab-label__text">${c.label}</span><span class="tab-label__dot"></span></div>
      <div class="wcard__line wcard__line--top"></div>
      <div class="wcard__line wcard__line--mid"></div>
      <h3 class="t-h3 wcard__title">${c.title}</h3>
      <p class="t-h4 wcard__sub">${c.subtitle}</p>
      <p class="t-body wcard__body">${c.body}</p>
      <div class="t-body wcard__list">${c.listTitle}<ul class="spaced">${c.list.map((l) => `<li>${l}</li>`).join('')}</ul></div>`;
    wheel.appendChild(el);
    return el;
  });

  const state = { u: 0, e: 0 };
  const wrap = (k) => ((k + n / 2) % n + n) % n - n / 2; // → [-n/2, n/2)

  function layout() {
    cards.forEach((el, i) => {
      const k = wrap(i - state.u);
      const vis = Math.abs(k) < 2.4;
      el.style.visibility = vis ? '' : 'hidden';
      if (!vis) return;
      const x = 308 + STEP * k + state.e * FAN_X * k;
      const y = state.e * FAN_Y * k * k;
      const rot = state.e * FAN_ROT * k;
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;
      el.style.zIndex = String(10 + Math.round(k)); // cards to the right sit above, so their tab overlaps the middle card
    });
  }
  layout();

  let dragging = false;
  let hover = false;
  const fan = (open) => gsap.to(state, { e: open ? 1 : 0, duration: 0.8, ease: 'power3.out', onUpdate: layout, overwrite: 'auto' });
  const goTo = (target, dur = 0.9) => gsap.to(state, { u: target, duration: dur, ease: 'power3.inOut', onUpdate: layout, overwrite: 'auto' });

  wheel.addEventListener('mouseenter', () => { hover = true; fan(true); });
  wheel.addEventListener('mouseleave', () => { hover = false; if (!dragging) fan(false); });

  document.getElementById('wheel-prev')?.addEventListener('click', () => goTo(Math.round(state.u) - 1));
  document.getElementById('wheel-next')?.addEventListener('click', () => goTo(Math.round(state.u) + 1));

  // pointer drag
  let startX = 0;
  let startU = 0;
  wheel.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    startU = state.u;
    wheel.classList.add('is-dragging');
    wheel.setPointerCapture(e.pointerId);
    gsap.killTweensOf(state);
    fan(true);
  });
  wheel.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    state.u = startU - (e.clientX - startX) / STEP;
    layout();
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    wheel.classList.remove('is-dragging');
    goTo(Math.round(state.u), 0.7);
    if (!hover) fan(false);
  };
  wheel.addEventListener('pointerup', endDrag);
  wheel.addEventListener('pointercancel', endDrag);

  // horizontal wheel / trackpad
  let wheelTimer;
  wheel.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    gsap.killTweensOf(state);
    state.u += e.deltaX / STEP;
    if (state.e < 1) fan(true);
    layout();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { goTo(Math.round(state.u), 0.6); if (!hover) fan(false); }, 140);
  }, { passive: false });
}
