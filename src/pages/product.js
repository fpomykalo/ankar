import { bootPage } from '../site.js';
import { lenis, gsap, ScrollTrigger } from '../lib/scroll.js';
import { initReveal } from '../lib/reveal.js';
import { productGroups } from '../data/product.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * One workflow group at a time. The tab row (Explore / Invent / Protect / Collaborate)
 * sticks under the nav while the group's items scroll; a tab swaps the group in place.
 * `#invent` and friends (mega-menu links) select a group on arrival.
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
    <article class="pitem"${reveal ? ' data-reveal' : ''}>
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
  const landY = () => group.getBoundingClientRect().top + window.scrollY - 120;
  const settle = () => { if (window.scrollY > landY()) lenis.scrollTo(landY(), { duration: 1, force: true, lock: true }); };
  function show(slug) {
    if (slug === active) { settle(); return; }
    gsap.to(group, { opacity: 0, duration: 0.25, overwrite: true, onComplete: () => { render(slug, false); gsap.to(group, { opacity: 1, duration: 0.35 }); } });
    settle();
  }
  const fromHash = () => productGroups.find((g) => `#${g.slug}` === location.hash)?.slug;

  const first = fromHash();
  render(first || productGroups[0].slug, true);
  if (first) { const land = () => lenis.scrollTo(landY(), { immediate: true, force: true }); requestAnimationFrame(land); setTimeout(land, 150); } // once layout has settled

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.ptab');
    if (!tab) return;
    e.preventDefault();
    e.stopPropagation(); // keep the global anchor handler out of it
    history.replaceState(null, '', `#${tab.dataset.slug}`);
    show(tab.dataset.slug);
  });
  window.addEventListener('hashchange', () => { const slug = fromHash(); if (slug) show(slug); });
}

bootPage(initProduct);
