import { gsap } from '../lib/scroll.js';
import { isMobile } from '../lib/mobile.js';
import wf1 from '../illustrations/wf1.html?raw';
import wf2 from '../illustrations/wf2.html?raw';
import wf3 from '../illustrations/wf3.html?raw';

/** "What Ankar makes possible": click an accordion item to open it and swap the illustration. */
export function initPossible() {
  const acc = document.getElementById('possible-acc');
  if (!acc) return;
  const slots = document.querySelectorAll('#illus .illus__item');
  const htmls = [wf2, wf1, wf3]; // item 1 evaluates (landscape drawing), item 2 finds evidence (A-to-B path), item 3 compounds knowledge
  const draw = (i) => { if (slots[i]) slots[i].innerHTML = htmls[i]; }; // re-inserting restarts the illustration's draw-in
  htmls.forEach((_, i) => draw(i));

  const items = Array.from(acc.querySelectorAll('.acc__item'));
  const illusPanel = document.getElementById('possible-panel');
  const mobile = isMobile(); // the illustration panel lives inside the open item, under its copy
  function setPhase(i, immediate) {
    items.forEach((item, idx) => {
      const open = idx === i;
      item.classList.toggle('is-open', open);
      const accPanel = item.querySelector('.acc__panel');
      if (mobile && open) accPanel.appendChild(illusPanel);
      const h = open ? accPanel.scrollHeight : 0;
      gsap.to(accPanel, { height: h, duration: immediate ? 0 : 0.6, ease: 'power3.inOut', overwrite: true });
    });
    slots.forEach((s, idx) => {
      if (idx === i && !s.classList.contains('is-on')) draw(idx);
      s.classList.toggle('is-on', idx === i);
    });
  }
  setPhase(0, true);
  // hovering an item opens it; the illustration plays once, and a click on the open item replays it
  items.forEach((item, i) => {
    item.addEventListener('mouseenter', () => setPhase(i));
    item.addEventListener('click', () => { if (item.classList.contains('is-open')) draw(i); else setPhase(i); });
  });
}
