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
    const update = () => {
      const cards = Array.from(strip.querySelectorAll('.fcard'));
      if (!cards.length) return;
      const x = strip.getBoundingClientRect().left + 16;
      let best = null;
      let bestD = Infinity;
      cards.forEach((c) => { const d = Math.abs(c.getBoundingClientRect().left - x); if (d < bestD) { bestD = d; best = c; } });
      cards.forEach((c) => c.classList.toggle('is-open', c === best));
    };
    let raf = 0;
    strip.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    update();
  });
}
