import { gsap } from './scroll.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const label = (t) => `<div class="tab-label"><span class="tab-label__text">${t}</span><span class="tab-label__dot"></span></div>`;
const layers = '<div class="fcard__shade"></div><div class="fcard__grad"></div><div class="fcard__grad-bottom"></div><div class="noise"></div>';

/** A 452px story card (customer stories, posts). */
export function storyCard(c) {
  const logo = c.logo ? `<img class="scard__logo" src="${BASE}/assets/svg/logos/${c.logo}-white.svg" width="${c.logoSize[0]}" height="${c.logoSize[1]}" alt="" />` : '';
  const author = c.author ? `<p class="t-mono scard__author">${c.author}</p>` : '';
  return `
    <a class="fcard folder is-open scard" href="${c.href || '#'}"${c.cat ? ` data-cat="${c.cat}"` : ''}>
      <img class="fcard__img" src="${c.image}" alt="" />
      ${layers}
      <div class="fcard__ui">
        ${label(c.label || c.cat)}
        <div class="fcard__line"></div>
        <h3 class="t-h4 scard__title">${c.title}</h3>
        ${author}${logo}
        <p class="t-mono scard__meta">${c.meta}</p>
      </div>
    </a>`;
}

/** The 1305px wide story card. */
export function wideCard(c) {
  return `
    <a class="fcard folder is-open scard scard--wide" href="${c.href || '#'}">
      <img class="fcard__img" src="${c.image}" alt="" />
      ${layers}
      <div class="fcard__ui">
        ${label(c.label)}
        <div class="fcard__line"></div>
        <h3 class="t-h3 scard__title">${c.title}</h3>
        ${c.author ? `<p class="t-mono scard__author">${c.author}</p>` : ''}
        <p class="t-mono scard__meta">${c.meta}</p>
      </div>
    </a>`;
}

/** Arrows, counter and dots under a card strip. */
export function pager(pageCount) {
  return `
    <div class="pager">
      <button class="arrow arrow--prev pager__prev" aria-label="Previous"><svg viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#000"/></svg></button>
      <span class="t-mono pager__count">1 / ${pageCount}</span>
      <button class="arrow arrow--next pager__next" aria-label="Next"><svg viewBox="0 0 10 18" fill="none"><path d="M1 1l8 8-8 8" stroke="#000"/></svg></button>
      <div class="pager__dots">${Array.from({ length: pageCount }, (_, p) => `<button class="bios__dot${p === 0 ? ' is-active' : ''}" type="button" aria-label="Page ${p + 1}"></button>`).join('')}</div>
    </div>`;
}

/**
 * A paged card strip: `pages` is an array of pages, each an array of card HTML strings.
 * The pages sit side by side on a track that slides left and right; `onRender` runs once
 * after the cards are in the DOM.
 */
export function initStrip({ folders, pager: pagerId, pages, onRender }) {
  const foldersEl = document.getElementById(folders);
  const pagerEl = document.getElementById(pagerId);
  if (!foldersEl || !pagerEl) return;
  foldersEl.classList.add('strip');
  foldersEl.innerHTML = `<div class="strip__track">${pages.map((p) => `<div class="strip__page">${p.join('')}</div>`).join('')}</div>`;
  const track = foldersEl.firstElementChild;
  pagerEl.innerHTML = pager(pages.length);
  const count = pagerEl.querySelector('.pager__count');
  const dots = Array.from(pagerEl.querySelectorAll('.bios__dot'));
  let page = 0;
  const go = (p) => {
    const next = (p + pages.length) % pages.length;
    if (next === page) return;
    page = next;
    gsap.to(track, { x: -page * 1305, duration: 0.9, ease: 'power3.inOut', overwrite: true });
    count.textContent = `${page + 1} / ${pages.length}`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === page));
  };
  onRender?.(foldersEl);
  pagerEl.querySelector('.pager__prev').addEventListener('click', () => go(page - 1));
  pagerEl.querySelector('.pager__next').addEventListener('click', () => go(page + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
}
