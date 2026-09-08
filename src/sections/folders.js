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
  const counter = document.getElementById('bios-counter');
  const dotsEl = document.getElementById('bios-dots');
  if (!track) return;
  const PER = 4;
  const pageCount = Math.ceil(people.length / PER);

  track.innerHTML = people.map((c, i) => `
    <article class="fcard folder${i === 0 ? ' is-open' : ''}">
      <img class="fcard__img" src="${c.image}" alt="" />
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
  const pageOffset = (p) => {
    // the first card of a page lands where card 1 sits (25px left of the container)
    let x = 0;
    for (let i = 0; i < p * PER; i += 1) x += (cards[i].classList.contains('is-open') ? 744 : 212) - 25;
    return x;
  };
  function showPage(p) {
    page = p;
    gsap.to(track, { x: -pageOffset(p), duration: 0.9, ease: 'power3.inOut' });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === p));
  }
  function setActive(i, fromHover = false) {
    active = (i + people.length) % people.length;
    cards.forEach((c, j) => c.classList.toggle('is-open', j === active));
    const p = Math.floor(active / PER);
    if (p !== page || !fromHover) showPage(p);
    counter.textContent = `${active + 1} / ${people.length}`;
    gsap.to([bioEl, roleEl], { opacity: 0, duration: 0.2, onComplete: () => {
      bioEl.innerHTML = people[active].bio;
      roleEl.innerHTML = people[active].role.split('<br>')[0];
      gsap.to([bioEl, roleEl], { opacity: 1, duration: 0.4 });
    } });
  }
  bioEl.innerHTML = people[0].bio;
  roleEl.innerHTML = people[0].role.split('<br>')[0];

  cards.forEach((c, i) => c.addEventListener('mouseenter', () => { if (i !== active) setActive(i, true); }));
  document.getElementById('bios-prev')?.addEventListener('click', () => setActive(active - 1));
  document.getElementById('bios-next')?.addEventListener('click', () => setActive(active + 1));
  dots.forEach((d, p) => d.addEventListener('click', () => setActive(p * PER)));
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
