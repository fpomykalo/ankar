import { gsap } from '../lib/scroll.js';
import wf1 from '../illustrations/wf1.html?raw';
import wf2 from '../illustrations/wf2.html?raw';
import wf3 from '../illustrations/wf3.html?raw';

/** "What Ankar makes possible": click an accordion item to open it and swap the illustration. */
export function initPossible() {
  const acc = document.getElementById('possible-acc');
  if (!acc) return;
  const slots = document.querySelectorAll('#illus .illus__item');
  const htmls = [wf1, wf2, wf3];
  const draw = (i) => { if (slots[i]) slots[i].innerHTML = htmls[i]; }; // re-inserting restarts the illustration's draw-in
  htmls.forEach((_, i) => draw(i));

  const items = Array.from(acc.querySelectorAll('.acc__item'));
  function setPhase(i, immediate) {
    items.forEach((item, idx) => {
      const open = idx === i;
      item.classList.toggle('is-open', open);
      const h = open ? item.querySelector('.acc__body').offsetHeight : 0;
      gsap.to(item.querySelector('.acc__panel'), { height: h, duration: immediate ? 0 : 0.6, ease: 'power3.inOut', overwrite: true });
    });
    slots.forEach((s, idx) => {
      if (idx === i && !s.classList.contains('is-on')) draw(idx);
      s.classList.toggle('is-on', idx === i);
    });
  }
  setPhase(0, true);
  items.forEach((item, i) => item.addEventListener('click', () => { const again = item.classList.contains('is-open'); setPhase(i); if (again) draw(i); })); // the illustration plays once; clicking the open item replays it
}
