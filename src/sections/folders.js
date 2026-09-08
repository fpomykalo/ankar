import { gsap } from '../lib/scroll.js';
import { industries, people, quotes } from '../data/content.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const LOGO_SIZES = {
  palantir: [92, 22], helsing: [97, 23], nlo: [55, 27], gsk: [70, 21], 'astra-zeneca': [142, 36],
  loreal: [122, 22], valeo: [84, 37], antheros: [122, 25],
};
const logoImg = (name) => {
  const [w, h] = LOGO_SIZES[name];
  return `<img src="${BASE}/assets/svg/logos/${name}-white.svg" width="${w}" height="${h}" alt="${name}" />`;
};
const shade = () => '<div class="fcard__shade"></div><div class="fcard__grad"></div><div class="fcard__grad-bottom"></div><div class="noise"></div>';
const label = (t) => `<div class="tab-label"><span class="tab-label__text">${t}</span><span class="tab-label__dot"></span></div>`;

/** Accordion behaviour: hovering a card opens it; the card hovered last stays open. */
function bindAccordion(container, onOpen) {
  const cards = Array.from(container.querySelectorAll('.fcard'));
  const open = (card) => {
    cards.forEach((c) => c.classList.toggle('is-open', c === card));
    onOpen?.(cards.indexOf(card));
  };
  cards.forEach((c) => c.addEventListener('mouseenter', () => open(c)));
  return open;
}

// --- industries ---------------------------------------------------------------
export function initIndustries() {
  const root = document.getElementById('industries-folders');
  if (!root) return;
  root.innerHTML = industries.map((c, i) => `
    <article class="fcard folder${i === 0 ? ' is-open' : ''}">
      <img class="fcard__img" src="${c.image}" alt="" />
      ${shade()}
      ${label(c.label)}
      <div class="fcard__line"></div>
      <div class="fcard__open">
        <h3 class="t-h3 fcard__title">${c.title.replace(/<br>/g, ' ')}</h3>
        <div class="fcard__line fcard__line--bottom"></div>
        <p class="t-body fcard__caption">${c.caption}</p>
      </div>
      <div class="fcard__closed"><h3 class="t-h3 fcard__vtitle">${c.title}</h3></div>
    </article>`).join('');
  bindAccordion(root);
}

// --- bios (12 people in one viewport-wide strip, paged by 4) ----------------
export function initBios() {
  const track = document.getElementById('bios-track');
  const bioEl = document.getElementById('bios-bio');
  const roleEl = document.getElementById('bios-role');
  const nameEl = document.getElementById('bios-name');
  const counter = document.getElementById('bios-counter');
  const dotsEl = document.getElementById('bios-dots');
  if (!track) return;
  const PER = 4;
  const pageCount = Math.ceil(people.length / PER);

  track.innerHTML = people.map((c, i) => `
    <article class="fcard folder${i === 0 ? ' is-open' : ''}">
      <img class="fcard__img" src="${c.image}" alt="" draggable="false" />
      ${shade()}
      ${label(c.label)}
      <div class="fcard__line"></div>
      <div class="fcard__open">
        <h3 class="t-h3 fcard__title">${c.name}</h3>
        <p class="t-mono fcard__meta">${c.role}</p>
        <div class="fcard__logos">${c.logos.map(logoImg).join('')}</div>
      </div>
      <div class="fcard__closed"><h3 class="t-h3 fcard__vtitle">${c.name}</h3></div>
    </article>`).join('');
  const cards = Array.from(track.children);
  dotsEl.innerHTML = Array.from({ length: pageCount }, (_, p) => `<button class="bios__dot${p === 0 ? ' is-active' : ''}" aria-label="Page ${p + 1}"></button>`).join('');
  const dots = Array.from(dotsEl.children);

  let active = 0;
  let page = 0;
  const pos = { x: 0 };
  const widthOf = (c) => (c.classList.contains('is-open') ? 744 : 212) - 25;
  const pageOffset = (p) => { let x = 0; for (let i = 0; i < p * PER; i += 1) x += widthOf(cards[i]); return x; };
  const apply = () => { track.style.transform = `translate3d(${pos.x}px,0,0)`; };
  const goTo = (x, dur = 0.9) => gsap.to(pos, { x, duration: dur, ease: 'power3.inOut', onUpdate: apply, overwrite: 'auto' });
  function showPage(p, dur) {
    page = p;
    goTo(-pageOffset(p), dur);
    dots.forEach((d, i) => d.classList.toggle('is-active', i === p));
  }
  function setText() {
    gsap.to([bioEl, roleEl, nameEl], { opacity: 0, duration: 0.2, onComplete: () => {
      bioEl.innerHTML = people[active].bio;
      nameEl.innerHTML = people[active].name.replace('<br>', ' ');
      roleEl.innerHTML = people[active].role.split('<br>')[0];
      gsap.to([bioEl, roleEl, nameEl], { opacity: 1, duration: 0.4 });
    } });
  }
  function setActive(i, { paging = true } = {}) {
    active = (i + people.length) % people.length;
    cards.forEach((c, j) => c.classList.toggle('is-open', j === active));
    counter.textContent = `${active + 1} / ${people.length}`;
    const p = Math.floor(active / PER);
    if (paging && p !== page) showPage(p);
    else if (paging) goTo(-pageOffset(page));
    setText();
  }
  bioEl.innerHTML = people[0].bio;
  nameEl.innerHTML = people[0].name.replace('<br>', ' ');
  roleEl.innerHTML = people[0].role.split('<br>')[0];

  // hover only highlights the card; it never moves the strip
  cards.forEach((c, i) => c.addEventListener('mouseenter', () => { if (i !== active && !dragging) setActive(i, { paging: false }); }));
  document.getElementById('bios-prev')?.addEventListener('click', () => setActive(active - 1));
  document.getElementById('bios-next')?.addEventListener('click', () => setActive(active + 1));
  dots.forEach((d, p) => d.addEventListener('click', () => { showPage(p); }));

  // drag / horizontal wheel moves the strip, snapping to the nearest page
  let dragging = false;
  let startX = 0;
  let startPos = 0;
  const maxX = () => -pageOffset(pageCount - 1);
  const snap = () => {
    let best = 0;
    let bestD = Infinity;
    for (let p = 0; p < pageCount; p += 1) { const d = Math.abs(-pageOffset(p) - pos.x); if (d < bestD) { bestD = d; best = p; } }
    showPage(best, 0.6);
  };
  track.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; startPos = pos.x;
    track.classList.add('is-dragging'); track.setPointerCapture(e.pointerId); gsap.killTweensOf(pos);
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    pos.x = Math.min(0, Math.max(maxX() - 100, startPos + (e.clientX - startX)));
    apply();
  });
  const endDrag = () => { if (!dragging) return; dragging = false; track.classList.remove('is-dragging'); snap(); };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  let wheelTimer;
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    gsap.killTweensOf(pos);
    pos.x = Math.min(0, Math.max(maxX() - 100, pos.x - e.deltaX));
    apply();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(snap, 140);
  }, { passive: false });
}

// --- quotes -----------------------------------------------------------------
export function initQuotes() {
  const root = document.getElementById('quotes-folders');
  if (!root) return;
  const bottoms = { loreal: 40, valeo: 30, antheros: 40 };
  root.innerHTML = quotes.map((c, i) => `
    <article class="fcard folder${i === 0 ? ' is-open' : ''}">
      <img class="fcard__img" src="${c.image}" alt="" />
      ${shade()}
      ${label(c.label)}
      <div class="fcard__line"></div>
      <div class="fcard__open">
        <h3 class="t-h3 fcard__title">${c.name}</h3>
        <span class="fcard__quote-mark">“</span>
        <p class="t-h4 fcard__quote">${c.quote}</p>
        <p class="t-mono fcard__meta fcard__meta--quote">${c.role}</p>
        <div class="fcard__logos">${logoImg(c.logo)}</div>
      </div>
      <div class="fcard__closed">
        <h3 class="t-h3 fcard__vtitle">${c.name}</h3>
        <div class="fcard__logo-bottom" style="bottom:${bottoms[c.logo]}px">${logoImg(c.logo)}</div>
      </div>
    </article>`).join('');
  bindAccordion(root);
}
