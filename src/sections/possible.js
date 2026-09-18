import { gsap } from '../lib/scroll.js';
import { isMobile } from '../lib/mobile.js';
import { driveDashAnimations } from '../lib/dashdraw.js';
import wf1 from '../illustrations/wf1.html?raw';
import wf2 from '../illustrations/wf2.html?raw';
import wf3 from '../illustrations/wf3.html?raw';

/** "What Ankar makes possible": click an accordion item to open it and swap the illustration. */
export function initPossible() {
  const acc = document.getElementById('possible-acc');
  if (!acc) return;
  const slots = document.querySelectorAll('#illus .illus__item');
  const htmls = [wf2, wf1, wf3]; // item 1 evaluates (landscape drawing), item 2 finds evidence (A-to-B path), item 3 compounds knowledge
  const mobile = isMobile();
  // re-inserting restarts the illustration's draw-in; the lines themselves are drawn from script (WebKit renders
  // an animated dash offset inside a mask wrongly, on the phone and in Safari)
  const stops = [];
  const draw = (i) => { if (!slots[i]) return; stops[i]?.(); slots[i].innerHTML = htmls[i]; stops[i] = driveDashAnimations(slots[i]); };
  if (!mobile) htmls.forEach((_, i) => draw(i));

  const items = Array.from(acc.querySelectorAll('.acc__item'));
  const illusPanel = document.getElementById('possible-panel');
  // On the phone each item carries its own copy of the gradient panel under its copy, so nothing is ever moved in the
  // DOM (moving an element restarts every CSS animation inside it). The item's illustration draws once its panel is open.
  const mSlots = mobile ? items.map((item) => {
    const panel = document.createElement('div');
    panel.className = 'possible__panel';
    panel.innerHTML = `<img class="possible__grad" src="${illusPanel.querySelector('.possible__grad').getAttribute('src')}" alt="" /><div class="noise"></div><div class="illus"><div class="illus__item is-on"></div></div>`;
    item.querySelector('.acc__panel').appendChild(panel);
    return panel.querySelector('.illus__item');
  }) : [];
  let drawTimer;
  let stopDash = () => {};
  function setPhase(i, immediate) {
    items.forEach((item, idx) => {
      const open = idx === i;
      item.classList.toggle('is-open', open);
      const accPanel = item.querySelector('.acc__panel');
      const h = open ? accPanel.scrollHeight : 0;
      gsap.to(accPanel, { height: h, duration: immediate ? 0 : 0.6, ease: 'power3.inOut', overwrite: true });
    });
    if (mobile) {
      clearTimeout(drawTimer);
      stopDash();
      mSlots.forEach((s, idx) => { if (idx !== i) s.innerHTML = ''; });
      const drawInto = () => { mSlots[i].innerHTML = htmls[i]; stopDash = driveDashAnimations(mSlots[i]); };
      if (immediate) drawInto(); else drawTimer = setTimeout(drawInto, 650); // once the panel has opened
      return;
    }
    slots.forEach((s, idx) => {
      if (idx === i && !s.classList.contains('is-on')) draw(idx);
      s.classList.toggle('is-on', idx === i);
    });
  }
  setPhase(0, true);
  // hovering an item opens it; the illustration plays once, and a click on the open item replays it
  items.forEach((item, i) => {
    if (mobile) { item.addEventListener('click', () => { if (!item.classList.contains('is-open')) setPhase(i); }); return; }
    item.addEventListener('mouseenter', () => setPhase(i));
    item.addEventListener('click', () => { if (item.classList.contains('is-open')) draw(i); else setPhase(i); });
  });
}
