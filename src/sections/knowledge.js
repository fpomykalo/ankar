import { gsap, ScrollTrigger, lenis, anchorTargets } from '../lib/scroll.js';
import { pillGroups } from '../data/content.js';
import wf1 from '../illustrations/wf1.html?raw';
import wf2 from '../illustrations/wf2.html?raw';
import wf3 from '../illustrations/wf3.html?raw';

/**
 * One pinned scene (locked 40px under the navigation), scrubbed by scroll:
 *   0. "The system where R&D knowledge compounds" is the stage's first layer
 *   1. the gradient panel (80vw × 80vh, title + CTA already on it) rises over it
 *   2. it expands into a full-viewport takeover; the intro layer fades away
 *   3. one continuous stream of pills travels from the back to the front; the
 *      title swaps as the stream crosses into the next knowledge group
 *   4. the gradient shrinks into the illustration panel; once it has landed,
 *      "What Ankar makes possible" rises in around it
 *   5. the three accordion phases are scrubbed (and clickable), then release
 */
const RISE = 600;
let HOLD_INTRO = 225; // a quarter viewport to read the three columns before the takeover
const EXPAND = 400;
const GROUP = 800;
const SHRINK = 800;
const REVEAL = 350;
const PHASE = 600;
const HOLD = 300;
const LOCK = 120;     // 40px under the 80px navigation

const OFFSETS = [
  [-80, 130], [340, -60], [-600, -220], [250, 280], [-360, 100], [520, -280], [-140, -320], [600, 150],
  [-660, 300], [160, 70], [-280, -140], [460, 50], [-500, 220], [80, -260], [620, -120], [-200, 320],
];
const F = 640;
const DZ = 300;   // closer spacing: more pills on screen at once

export function initKnowledge() {
  const stage = document.getElementById('knowledge-stage');
  const bg = document.getElementById('tk-bg');
  const pillsEl = document.getElementById('tk-pills');
  const titlesEl = document.getElementById('tk-titles');
  const cta = document.getElementById('tk-cta');
  const possible = document.getElementById('possible');
  const placeholder = document.getElementById('possible-panel');
  const illus = document.getElementById('illus');
  const numEl = document.getElementById('tk-num');
  const skip = document.getElementById('tk-skip');
  const introLayer = document.getElementById('intro-layer');
  const lightBg = document.getElementById('knowledge-bg');
  if (!stage) return;

  const slots = illus.querySelectorAll('.illus__item');
  [wf1, wf2, wf3].forEach((html, i) => { slots[i].innerHTML = html; });

  // --- titles + one continuous pill stream ------------------------------------
  const titles = [];
  const nums = [];
  const pills = [];
  pillGroups.forEach((g, gi) => {
    const title = document.createElement('h2');
    title.className = 'tk-title';
    title.textContent = g.title;
    const n = document.createElement('span');
    n.textContent = String(gi + 1).padStart(2, '0');
    numEl.appendChild(n);
    nums.push(n);
    titlesEl.appendChild(title);
    titles.push(title);
    g.items.forEach((label, i) => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.innerHTML = `<span class="pill__tag">${String(gi + 1).padStart(2, '0')} / ${String.fromCharCode(65 + i)}</span><span>${label}</span>`;
      el.style.display = 'none';
      pillsEl.appendChild(el);
      const idx = pills.length;
      const [ox, oy] = OFFSETS[idx % OFFSETS.length];
      pills.push({ el, ox, oy, gi, z: F * 1.4 + idx * DZ });
    });
  });
  gsap.set(titles, { xPercent: -50, yPercent: -100, y: 20 }); // 50% higher than centre, then 20px down
  gsap.set(titles[0], { opacity: 1, scale: 0.8 });
  // number sits 38px above the title's cap top (title top = 50% - 75px + 20px) and never moves
  gsap.set(numEl, { xPercent: -50, y: -93 });
  gsap.set(nums[0], { opacity: 1 });
  gsap.set(cta, { xPercent: -50, opacity: 1 });
  gsap.set(skip, { xPercent: -50, opacity: 1 });

  const vw = () => stage.clientWidth;
  const vh = () => window.innerHeight;
  const targetRect = () => {
    const r = placeholder.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height };
  };

  // "What Ankar makes possible" must fit the viewport under the navigation
  const lifecycle = document.getElementById('lifecycle');
  const fitPossible = () => {
    const need = 244 + 484 + 40;
    const avail = vh() - LOCK;
    const scale = Math.min(1, avail / need);
    gsap.set(possible, { scale, transformOrigin: '0 0' });
    // keep exactly 200px between the accordion's end and the next section's rule
    const contentBottom = LOCK + (244 + 484) * scale;
    if (lifecycle) lifecycle.style.marginTop = `${contentBottom + 200 - 200 - stage.clientHeight}px`;
  };
  HOLD_INTRO = Math.round(vh() * 0.25);
  fitPossible();
  ScrollTrigger.addEventListener('refreshInit', fitPossible);

  const T_RISE = HOLD_INTRO;
  const T_EXPAND = T_RISE + RISE;
  const T_GROUPS = T_EXPAND + EXPAND;
  const SPAN = GROUP * pillGroups.length;
  const T_SHRINK = T_GROUPS + SPAN;
  const T_REVEAL = T_SHRINK + SHRINK;
  const T_PHASES = T_REVEAL + REVEAL;
  const TOTAL = T_PHASES + PHASE * 2 + HOLD;
  const zEnd = pills[pills.length - 1].z + F * 0.55;
  const camAt = (px) => Math.min(1, Math.max(0, (px - T_GROUPS) / SPAN)) * zEnd;
  // moment the first pill of a group is about to arrive at the front
  const groupTime = (gi) => T_GROUPS + ((pills.find((p) => p.gi === gi).z - F * 0.45) / zEnd) * SPAN;

  gsap.set(bg, { left: () => vw() * 0.1, top: () => vh(), width: () => vw() * 0.8, height: () => vh() * 0.8, borderRadius: 30 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: `+=${TOTAL}`,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (st) => update(st.progress * TOTAL),
      onRefresh: (st) => update(st.progress * TOTAL),
    },
  });

  // 1. rise over the intro layer
  tl.to(bg, { top: () => vh() * 0.1, duration: RISE, ease: 'power1.out' }, T_RISE);
  // 2. expand; the intro layer goes, the light stage background comes
  tl.to(bg, { left: 0, top: 0, width: () => vw(), height: () => vh(), borderRadius: 0, duration: EXPAND, ease: 'power1.inOut' }, T_EXPAND);
  tl.to(titles[0], { scale: 1, duration: EXPAND, ease: 'power1.inOut' }, T_EXPAND);
  tl.to(introLayer, { opacity: 0, duration: EXPAND * 0.6 }, T_EXPAND);
  tl.set(introLayer, { visibility: 'hidden' }, T_EXPAND + EXPAND);
  tl.to(lightBg, { opacity: 1, duration: 100 }, T_EXPAND + EXPAND - 100);
  // 3. title swaps as the stream crosses into each group
  titles.forEach((title, i) => {
    if (i === 0) return;
    const t = groupTime(i);
    tl.to(titles[i - 1], { y: -50, opacity: 0, duration: 220, ease: 'power2.in' }, t);
    tl.fromTo(title, { y: 90, opacity: 0 }, { y: 20, opacity: 1, duration: 220, ease: 'power2.out' }, t + 60);
    tl.to(nums[i - 1], { opacity: 0, duration: 120 }, t);
    tl.to(nums[i], { opacity: 1, duration: 140 }, t + 120);
  });
  // 4. shrink into the illustration panel
  tl.to(titles[titles.length - 1], { y: -50, opacity: 0, duration: 200, ease: 'power2.in' }, T_SHRINK);
  tl.to(nums[nums.length - 1], { opacity: 0, duration: 160 }, T_SHRINK);
  tl.to([cta, skip], { opacity: 0, duration: 160 }, T_SHRINK);
  tl.to(bg, {
    left: () => targetRect().left, top: () => targetRect().top, width: () => targetRect().width, height: () => targetRect().height,
    borderRadius: 30, duration: SHRINK - 100, ease: 'power2.inOut',
  }, T_SHRINK + 100);
  // once the box is in position, the section copy rises in around it
  tl.set(possible, { visibility: 'visible' }, T_REVEAL);
  tl.to(possible.querySelectorAll('[data-tk-reveal]'), { y: 0, opacity: 1, duration: REVEAL - 60, stagger: 40, ease: 'power3.out' }, T_REVEAL);
  tl.to(illus, { opacity: 1, duration: 200 }, T_REVEAL);
  tl.to({}, { duration: 1 }, TOTAL - 1);

  // --- pills: one continuous journey through all groups --------------------------
  let shown = false;
  function update(px) {
    const inStream = px >= T_GROUPS && px < T_SHRINK + 220;
    if (inStream !== shown) {
      pills.forEach((p) => { p.el.style.display = inStream ? '' : 'none'; });
      shown = inStream;
    }
    if (!inStream) return;
    const cam = camAt(px);
    const streamIn = Math.min(1, (px - T_GROUPS) / 260); // the first pills fade in instead of popping
    const fade = (px > T_SHRINK ? Math.max(0, 1 - (px - T_SHRINK) / 200) : 1) * streamIn;
    const cx = vw() / 2;
    const cy = vh() / 2;
    pills.forEach((p) => {
      const d = p.z - cam;
      if (d <= -F * 0.72 || d > 3600) { p.el.style.opacity = 0; return; }
      const s = F / (F + d);
      const blur = d > 0 ? Math.min(12, d / 210) : Math.min(10, -d / 45);
      const oIn = Math.min(1, Math.max(0, (3400 - d) / 1000));
      const oOut = d < -60 ? Math.max(0, 1 - (-d - 60) / 320) : 1;
      p.el.style.opacity = (oIn * oOut * fade).toFixed(3);
      p.el.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : 'none';
      p.el.classList.toggle('is-front', s > 0.8); // far pills stay behind title + CTA, they pass in front only near arrival
      p.el.style.transform = `translate(${(cx + p.ox * s).toFixed(1)}px, ${(cy + p.oy * s).toFixed(1)}px) translate(-50%, -50%) scale(${s.toFixed(4)})`;
    });
  }

  // --- accordion phases -------------------------------------------------------------
  const items = Array.from(document.querySelectorAll('#possible-acc .acc__item'));
  let phase = 0;
  function setPhase(i, immediate) {
    phase = i;
    items.forEach((item, idx) => {
      const open = idx === i;
      item.classList.toggle('is-open', open);
      const h = open ? item.querySelector('.acc__body').offsetHeight : 0;
      gsap.to(item.querySelector('.acc__panel'), { height: h, duration: immediate ? 0 : 0.6, ease: 'power3.inOut' });
    });
    slots.forEach((s, idx) => s.classList.toggle('is-on', idx === i));
  }
  setPhase(0, true);

  const st = tl.scrollTrigger;
  anchorTargets.possible = () => st.start + T_PHASES; // nav "Our Value": What Ankar makes possible, fully revealed
  skip.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    lenis.scrollTo(st.start + T_PHASES, { duration: 1.4, force: true, lock: true }); // lands on What Ankar makes possible, fully revealed
  });
  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: `+=${TOTAL}`,
    onUpdate: (self) => {
      const px = self.progress * TOTAL;
      const p = px < T_PHASES ? 0 : Math.min(2, Math.floor((px - T_PHASES) / PHASE));
      if (p !== phase) setPhase(p);
    },
  });
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (st.isActive) lenis.scrollTo(st.start + T_PHASES + PHASE * i + 40, { duration: 1 });
      setPhase(i);
    });
  });
}
