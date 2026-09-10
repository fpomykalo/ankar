import { bootPage } from '../site.js';
import { gsap } from '../lib/scroll.js';
import { securityItems } from '../data/pages.js';

/** Three pillars: click one to open its copy and show its detail rows on the gradient panel. Nothing pins. */
function initSecurity() {
  const acc = document.getElementById('sacc');
  const rows = document.getElementById('spanel-rows');
  if (!acc) return;
  acc.innerHTML = securityItems.map((it, i) => `
    <div class="sacc__item${i === 0 ? ' is-open' : ''}" data-index="${i}">
      <div class="rule"></div>
      <span class="t-mono sacc__n">${it.n}</span>
      <h3 class="t-h4 sacc__title">${it.title}</h3>
      <div class="sacc__panel"><p class="t-body sacc__body">${it.body}</p></div>
    </div>`).join('');
  const items = Array.from(acc.children);
  const renderRows = (it) => rows.innerHTML = it.rows.map(([n, text]) => `
    <div class="srow"><div class="rule"></div><span class="t-mono srow__n">${n}</span><p class="t-body srow__text">${text}</p></div>`).join('');

  function open(i, immediate) {
    items.forEach((item, idx) => {
      const on = idx === i;
      item.classList.toggle('is-open', on);
      const h = on ? item.querySelector('.sacc__body').offsetHeight : 0;
      gsap.to(item.querySelector('.sacc__panel'), { height: h, duration: immediate ? 0 : 0.6, ease: 'power3.inOut', overwrite: true });
    });
    if (immediate) { renderRows(securityItems[i]); return; }
    gsap.to(rows, { opacity: 0, duration: 0.2, onComplete: () => { renderRows(securityItems[i]); gsap.to(rows, { opacity: 1, duration: 0.3 }); } });
  }
  // the gradient panel is as tall as the accordion gets (its tallest item open), and the
  // section keeps that height whichever item is open
  const closed = items.reduce((sum, item) => sum + item.offsetHeight, 0); // every panel starts at height 0
  const tallest = Math.max(...items.map((item) => item.querySelector('.sacc__body').offsetHeight));
  const panel = document.querySelector('.spanel');
  panel.style.height = `${closed + tallest}px`;
  panel.parentElement.style.minHeight = `${acc.offsetTop + closed + tallest}px`;
  open(0, true);
  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
}

bootPage(initSecurity);
