import { bootPage } from '../site.js';
import { lenis } from '../lib/scroll.js';
import { productGroups } from '../data/product.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Four workflow groups. Each group's header bar (number, title, the four tabs) is
 * sticky while its items scroll past, and the next group's bar takes over.
 */
function initProduct() {
  const root = document.getElementById('product-groups');
  if (!root) return;
  const tabs = (active) => productGroups.map((g) => `<a class="ptab${g.slug === active ? ' is-active' : ''}" href="#${g.slug}"><span>${g.title}</span></a>`).join('');
  root.innerHTML = productGroups.map((g) => `
    <section class="pgroup" id="${g.slug}">
      <div class="pbar">
        <div class="container">
          <div class="rule pbar__rule"></div>
          <span class="t-h2 pbar__n">${g.n}.</span>
          <h2 class="t-h2 pbar__title">${g.title}</h2>
          <nav class="pbar__tabs" aria-label="Workflow groups">${tabs(g.slug)}</nav>
        </div>
      </div>
      <div class="container pgroup__items">
        ${g.items.map((it) => `
        <article class="pitem" data-reveal>
          <div class="rule pitem__rule"></div>
          <span class="t-mono pitem__n">${it.n}</span>
          <h3 class="t-h4 pitem__title">${it.title}</h3>
          <p class="t-body pitem__body">${it.body}</p>
          <div class="pitem__ui pui--${it.ui}"><img src="${BASE}/assets/images/ui/ui-${it.ui === 'a' ? '1' : '2'}.png" alt="Ankar platform interface" /></div>
        </article>`).join('')}
      </div>
    </section>`).join('');

  // a tab scrolls its group's bar to the top of the viewport, where it sticks
  root.addEventListener('click', (e) => {
    const tab = e.target.closest('.ptab');
    if (!tab) return;
    e.preventDefault();
    e.stopPropagation();
    const group = document.getElementById(tab.getAttribute('href').slice(1));
    if (group) lenis.scrollTo(group, { offset: 55, duration: 1.2, force: true, lock: true }); // the bar itself lands at the top and sticks
  });
}

bootPage(initProduct);
