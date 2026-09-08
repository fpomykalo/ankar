import { gsap, lenis } from '../lib/scroll.js';
import { industries, people, quotes } from '../data/content.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const LOGO_SIZES = {
  palantir: [92, 22], helsing: [97, 23], nlo: [55, 27], gsk: [70, 21], 'astra-zeneca': [122, 31],
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
      <div class="fcard__ui">
      ${label(c.label)}
      <div class="fcard__line"></div>
      <div class="fcard__open">
        <h3 class="t-h3 fcard__title">${c.openTitle || c.title.replace(/<br>/g, ' ')}</h3>
        <div class="fcard__line fcard__line--bottom"></div>
        <p class="t-body fcard__caption">${c.caption}</p>
      </div>
      <div class="fcard__closed"><h3 class="t-h3 fcard__vtitle">${c.title}</h3></div>
      </div>
    </article>`).join('');
  bindAccordion(root);
}

// --- bios (one viewport-wide strip, paged by 4; click a card for the full bio) -----
export function initBios() {
  const track = document.getElementById('bios-track');
  const counter = document.getElementById('bios-counter');
  const dotsEl = document.getElementById('bios-dots');
  if (!track) return;
  const PER = 4;
  const n = people.length;
  const pageCount = Math.ceil(n / PER);
  const pageStart = (p) => (p === pageCount - 1 ? Math.max(0, n - PER) : p * PER);

  track.innerHTML = people.map((c, i) => `
    <article class="fcard folder${i === 0 ? ' is-open' : ''}">
      <img class="fcard__img" src="${c.image}" alt="" draggable="false"${c.focus ? ` style="object-position:${c.focus}"` : ''} />
      ${shade()}
      <div class="fcard__ui">
      ${label(c.label)}
      <div class="fcard__line"></div>
      <div class="fcard__open">
        <h3 class="t-h3 fcard__title">${c.name.replace('<br>', ' ')}</h3>
        <p class="t-mono fcard__meta">${c.role}</p>
        <div class="fcard__logos">${c.logos.map(logoImg).join('')}</div>
        <p class="t-body fcard__excerpt">${c.bio.split('<br>')[0]}</p>
        <p class="t-mono fcard__more"><u>Click for full Bio</u></p>
        <div class="t-body fcard__full" data-lenis-prevent>${c.bio}</div>
        <div class="fcard__scroll"><div class="fcard__thumb"></div></div>
      </div>
      <div class="fcard__closed"><h3 class="t-h3 fcard__vtitle">${c.name}</h3></div>
      </div>
    </article>`).join('');
  const cards = Array.from(track.children);
  // custom scrollbar for the full bio (thumb is draggable)
  cards.forEach((c) => {
    const full = c.querySelector('.fcard__full');
    const thumb = c.querySelector('.fcard__thumb');
    const trackH = 253;
    const update = () => {
      const ratio = full.clientHeight / full.scrollHeight;
      const h = ratio >= 1 ? trackH : Math.max(30, Math.round(trackH * ratio));
      const maxScroll = full.scrollHeight - full.clientHeight;
      const top = maxScroll > 0 ? Math.round((trackH - h) * (full.scrollTop / maxScroll)) : 0;
      thumb.style.height = `${h}px`;
      thumb.style.transform = `translateY(${top}px)`;
    };
    full.addEventListener('scroll', update);
    c.addEventListener('transitionend', update);
    update();
    let dragY = null;
    let dragTop = 0;
    thumb.addEventListener('pointerdown', (e) => { e.stopPropagation(); dragY = e.clientY; dragTop = full.scrollTop; thumb.setPointerCapture(e.pointerId); });
    thumb.addEventListener('pointermove', (e) => {
      if (dragY === null) return;
      const h = thumb.offsetHeight;
      const maxScroll = full.scrollHeight - full.clientHeight;
      full.scrollTop = dragTop + ((e.clientY - dragY) / (trackH - h)) * maxScroll;
    });
    const endThumb = () => { dragY = null; };
    thumb.addEventListener('pointerup', endThumb);
    thumb.addEventListener('pointercancel', endThumb);
    // while the pointer is over an open bio the page scroller pauses, so the wheel only moves the text
    c.addEventListener('mouseenter', () => { if (c.classList.contains('is-expanded')) lenis.stop(); });
    c.addEventListener('mouseleave', () => lenis.start());
  });
  const wheelDelta = (e) => (e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY);
  // document-level, capture phase: nothing else can see the wheel before the bio does
  document.addEventListener('wheel', (e) => {
    const expanded = e.target.closest?.('#bios-track .fcard.is-expanded');
    if (!expanded || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    expanded.querySelector('.fcard__full').scrollTop += wheelDelta(e);
  }, { passive: false, capture: true });
  dotsEl.innerHTML = Array.from({ length: pageCount }, (_, p) => `<button class="bios__dot${p === 0 ? ' is-active' : ''}" aria-label="Page ${p + 1}"></button>`).join('');
  const dots = Array.from(dotsEl.children);

  let active = 0;
  let page = 0;
  const pos = { x: 0 };
  const widthOf = (c) => (c.classList.contains('is-open') ? 744 : 212) - 25;
  const pageOffset = (p) => { let x = 0; for (let i = 0; i < pageStart(p); i += 1) x += widthOf(cards[i]); return x; };
  const apply = () => { track.style.transform = `translate3d(${pos.x}px,0,0)`; };
  const goTo = (x, dur = 0.9) => gsap.to(pos, { x, duration: dur, ease: 'power3.inOut', onUpdate: apply, overwrite: 'auto' });
  function showPage(p, dur) {
    page = p;
    goTo(-pageOffset(p), dur);
    dots.forEach((d, i) => d.classList.toggle('is-active', i === p));
  }
  const pageOf = (i) => Math.min(pageCount - 1, Math.floor(i / PER));
  function setActive(i, { paging = true } = {}) {
    const prev = active;
    active = (i + n) % n;
    cards.forEach((c, j) => { c.classList.toggle('is-open', j === active); if (j !== active) { c.classList.remove('is-expanded'); c.removeAttribute('data-lenis-prevent'); } });
    lenis.start();
    counter.textContent = `${active + 1} / ${n}`;
    const p = pageOf(active);
    if (paging && p !== page) showPage(p);
    // keep the page anchored when a card that sits before it (off to the left) just shrank
    else if (paging || prev < pageStart(page)) goTo(-pageOffset(page), 0.7);
  }

  cards.forEach((c, i) => c.addEventListener('mouseenter', () => { if (i !== active && !dragging) setActive(i, { paging: false }); }));
  document.getElementById('bios-prev')?.addEventListener('click', () => setActive(active - 1));
  document.getElementById('bios-next')?.addEventListener('click', () => setActive(active + 1));
  dots.forEach((d, p) => d.addEventListener('click', () => { showPage(p); }));

  // drag / horizontal wheel moves the strip (snapping to pages); a plain click toggles the full bio
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startPos = 0;
  let downCard = null; // pointer capture retargets the release to the track, so remember the card
  let inBio = false;   // a press inside the open bio never drags the strip; a plain click there closes the bio
  const maxX = () => -pageOffset(pageCount - 1);
  const snap = () => {
    let best = 0;
    let bestD = Infinity;
    for (let p = 0; p < pageCount; p += 1) { const d = Math.abs(-pageOffset(p) - pos.x); if (d < bestD) { bestD = d; best = p; } }
    showPage(best, 0.6);
  };
  track.addEventListener('pointerdown', (e) => {
    inBio = !!e.target.closest('.fcard__full');
    downCard = e.target.closest('.fcard');
    dragging = true; moved = false; startX = e.clientX; startPos = pos.x;
    track.setPointerCapture(e.pointerId); gsap.killTweensOf(pos);
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) { moved = true; if (!inBio) track.classList.add('is-dragging'); }
    if (!moved || inBio) return;
    pos.x = Math.min(0, Math.max(maxX() - 100, startPos + dx));
    apply();
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    if (moved) { if (!inBio) snap(); return; }
    // click: open the card, or toggle its full bio when it is already open
    const card = downCard;
    if (!card) return;
    const i = cards.indexOf(card);
    if (i !== active) setActive(i, { paging: false });
    else {
      const open = card.classList.toggle('is-expanded');
      card.toggleAttribute('data-lenis-prevent', open);
      if (open) lenis.stop(); else lenis.start();
    }
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', () => { dragging = false; track.classList.remove('is-dragging'); if (moved) snap(); });
  let wheelTimer;
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    gsap.killTweensOf(pos);
    pos.x = Math.min(0, Math.max(maxX() - 100, pos.x - e.deltaX));
    apply();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(snap, 140);
  }, { passive: false, capture: true });
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
      <div class="fcard__ui">
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
      </div>
    </article>`).join('');
  bindAccordion(root);
}
