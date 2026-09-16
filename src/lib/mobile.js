/** The phone layout (Figma "Mobile", 393 wide) applies under 768px. Scripts branch on it once, at boot. */
const mq = window.matchMedia('(max-width: 767px)');
export const isMobile = () => mq.matches;

/** On the phone every text runs gutter to gutter: single line breaks go, paragraph breaks (two in a row) stay. */
export function stripBreaks(root = document) {
  if (!isMobile()) return;
  root.querySelectorAll('br').forEach((br) => {
    if (br.parentElement.closest('.t-mono')) return; // mono labels (roles, bylines) keep their lines
    const skip = (n, dir) => { while (n && n.nodeType === 3 && !n.textContent.trim()) n = n[dir]; return n; }; // whitespace between two breaks
    if (skip(br.previousSibling, 'previousSibling')?.nodeName === 'BR' || skip(br.nextSibling, 'nextSibling')?.nodeName === 'BR') return;
    br.replaceWith(' ');
  });
}

/** Card strips scroll natively on the phone; the card snapped into view is the open one (in colour), the rest are black and white. */
export function initMobileStrips(root = document) {
  if (!isMobile()) return;
  root.querySelectorAll('.folders').forEach((strip) => {
    if (strip.dataset.tracked) return;
    strip.dataset.tracked = '1';
    if (strip.id === 'blog-folders') { strip.querySelectorAll('.fcard').forEach((c) => c.classList.add('is-open')); return; } // a vertical list: every card in colour
    const visible = () => Array.from(strip.querySelectorAll('.fcard')).filter((c) => c.offsetParent !== null); // the strips repeat their page; only the shown one counts
    const update = () => {
      const cards = visible();
      if (!cards.length) return;
      const x = strip.getBoundingClientRect().left + 16;
      let best = null;
      let bestD = Infinity;
      cards.forEach((c) => { const d = Math.abs(c.getBoundingClientRect().left - x); if (d < bestD) { bestD = d; best = c; } });
      cards.forEach((c) => c.classList.toggle('is-open', c === best));
      dots.forEach((d, i) => d.classList.toggle('is-active', cards[i] === best));
    };
    // one dot per card under the strip (the people strip and the paged blog grid bring their own)
    const own = strip.classList.contains('folders--bios');
    const cardsNow = visible();
    let dots = [];
    if (!own && cardsNow.length > 1) {
      const el = document.createElement('div');
      el.className = 'strip-dots';
      el.innerHTML = cardsNow.map((_, i) => `<button class="bios__dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Card ${i + 1}"></button>`).join('');
      strip.insertAdjacentElement('afterend', el);
      dots = Array.from(el.children);
      dots.forEach((d, i) => d.addEventListener('click', () => strip.scrollTo({ left: i * (cardsNow[0].offsetWidth - 25), behavior: 'smooth' })));
    }
    let raf = 0;
    strip.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    update();
  });
}
