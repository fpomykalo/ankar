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

/** Arrows, counter and dots under a card strip. Static for now: the strips hold one page. */
export function pager(count) {
  return `
    <div class="pager">
      <button class="arrow arrow--prev pager__prev" aria-label="Previous"><svg viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="#000"/></svg></button>
      <span class="t-mono pager__count">1 / ${count}</span>
      <button class="arrow arrow--next pager__next" aria-label="Next"><svg viewBox="0 0 10 18" fill="none"><path d="M1 1l8 8-8 8" stroke="#000"/></svg></button>
      <div class="pager__dots"><span class="bios__dot is-active"></span></div>
    </div>`;
}
