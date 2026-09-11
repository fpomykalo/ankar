import { bootPage } from '../site.js';
import { lenis, gsap, ScrollTrigger } from '../lib/scroll.js';
import { initReveal } from '../lib/reveal.js';
import { productGroups } from '../data/product.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
// layout position, unaffected by the reveal transforms still in flight on arrival
const layoutTop = (el) => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * One workflow group at a time. The tab row (Explore / Invent / Protect / Collaborate)
 * sticks under the nav while the group's items scroll; a tab swaps the group in place.
 * `#invent` (mega-menu group links) selects a group on arrival; `#experiment-design`
 * (item links) selects its group and anchors to the item.
 */
function initProduct() {
  const wrap = document.getElementById('workflows');
  if (!wrap) return;
  const tabsEl = document.getElementById('ptabs');
  const group = document.getElementById('pgroup');
  const nEl = document.getElementById('pgroup-n');
  const titleEl = document.getElementById('pgroup-title');
  const itemsEl = document.getElementById('pitems');

  tabsEl.innerHTML = productGroups.map((g) => `<a class="ptab" href="#${g.slug}" data-slug="${g.slug}"><span>${g.tab}</span></a>`).join('');
  const tabs = Array.from(tabsEl.children);
  const item = (it, reveal) => `
    <article class="pitem" id="${slug(it.title)}"${reveal ? ' data-reveal' : ''}>
      <div class="rule pitem__rule"></div>
      <span class="t-mono pitem__n">${it.n}</span>
      <h3 class="t-h4 pitem__title">${it.title}</h3>
      <p class="t-body pitem__body">${it.body}</p>
      <div class="pitem__ui pui--${it.ui}"><img src="${BASE}/assets/images/ui/ui-${it.ui === 'a' ? '1' : '2'}.png" alt="Ankar platform interface" /></div>
    </article>`;

  let active = null;
  function render(slug, reveal) {
    const g = productGroups.find((x) => x.slug === slug) || productGroups[0];
    active = g.slug;
    tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.slug === g.slug));
    nEl.textContent = `${g.n}.`;
    titleEl.innerHTML = g.title;
    itemsEl.innerHTML = g.items.map((it) => item(it, reveal)).join('');
    if (reveal) initReveal(itemsEl);
    ScrollTrigger.refresh();
  }
  // where a tab lands the page: the group's rule sits 40px under the nav (nav bottom at 80)
  const landY = () => layoutTop(group) - 120;
  const itemY = (id) => { const el = id && document.getElementById(id); return el ? layoutTop(el) - 120 : null; };
  const settle = () => { if (window.scrollY > landY()) lenis.scrollTo(landY(), { duration: 1, force: true, lock: true }); };
  // a tab only settles the page when the head has scrolled away; an item link always anchors to its item
  function show(groupSlug, itemId) {
    const goItem = () => { const y = itemY(itemId); if (y != null) lenis.scrollTo(y, { duration: 1.2, force: true, lock: true }); };
    if (groupSlug === active) { if (itemId) goItem(); else settle(); return; }
    gsap.to(group, { opacity: 0, duration: 0.25, overwrite: true, onComplete: () => { render(groupSlug, false); gsap.to(group, { opacity: 1, duration: 0.35 }); if (itemId) goItem(); } });
    if (!itemId) settle();
  }
  // "#invent" names a group, "#experiment-design" an item inside one
  const fromHash = () => {
    const id = location.hash.slice(1);
    if (!id) return null;
    const g = productGroups.find((x) => x.slug === id);
    if (g) return { group: g.slug };
    const owner = productGroups.find((x) => x.items.some((it) => slug(it.title) === id));
    return owner ? { group: owner.slug, item: id } : null;
  };

  const first = fromHash();
  render(first?.group || productGroups[0].slug, true);
  if (first) { const land = () => lenis.scrollTo(first.item ? itemY(first.item) : landY(), { immediate: true, force: true }); requestAnimationFrame(land); setTimeout(land, 150); } // once layout has settled

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.ptab');
    if (!tab) return;
    e.preventDefault();
    e.stopPropagation(); // keep the global anchor handler out of it
    history.replaceState(null, '', `#${tab.dataset.slug}`);
    show(tab.dataset.slug);
  });
  window.addEventListener('hashchange', () => { const h = fromHash(); if (h) show(h.group, h.item); });
}

bootPage(initProduct);
