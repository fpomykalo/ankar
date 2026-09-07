import { gsap } from '../lib/scroll.js';
import { partnerships } from '../data/content.js';

/** Six rows in two columns; hovering a row reveals its copy (last hovered stays open). */
export function initPartnerships() {
  const grid = document.getElementById('pgrid');
  if (!grid) return;
  const cols = [[], []];
  partnerships.forEach((p, i) => cols[i % 2].push(p));
  grid.innerHTML = cols.map((rows) => `<div class="pgrid__col">${rows.map((r) => `
    <div class="prow">
      <div class="rule"></div>
      <span class="t-mono prow__n">${r.n}</span>
      <h3 class="t-h4 prow__title">${r.title}</h3>
      <div class="prow__panel"><p class="t-body prow__body">${r.body}</p></div>
    </div>`).join('')}</div>`).join('');

  grid.querySelectorAll('.pgrid__col').forEach((col) => {
    const rows = Array.from(col.querySelectorAll('.prow'));
    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        rows.forEach((r) => {
          const open = r === row;
          r.classList.toggle('is-open', open);
          const panel = r.querySelector('.prow__panel');
          gsap.to(panel, { height: open ? r.querySelector('.prow__body').offsetHeight : 0, duration: 0.55, ease: 'power3.inOut' });
        });
      });
    });
  });
}
