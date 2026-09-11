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

  // The grid is absolute, so the section is sized here: tall enough for the tallest open row,
  // with the next section's divider (120px under the section) sitting 50px under that row's copy.
  // A row's stack bottom = column closed height + its body; the copy ends 40px above that (paddings).
  const cols2 = Array.from(grid.querySelectorAll('.pgrid__col'));
  const tallest = Math.max(...cols2.map((col) => col.offsetHeight + Math.max(...Array.from(col.querySelectorAll('.prow__body')).map((b) => b.offsetHeight))));
  grid.parentElement.style.height = `${grid.offsetTop + tallest - 40 + 50 - 120}px`;

  grid.querySelectorAll('.pgrid__col').forEach((col) => {
    const rows = Array.from(col.querySelectorAll('.prow'));
    const set = (row, open) => {
      row.classList.toggle('is-open', open);
      gsap.to(row.querySelector('.prow__panel'), { height: open ? row.querySelector('.prow__body').offsetHeight : 0, duration: 0.45, ease: 'power3.inOut', overwrite: true });
    };
    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => rows.forEach((r) => set(r, r === row)));
      row.addEventListener('mouseleave', () => set(row, false));
    });
  });
}
