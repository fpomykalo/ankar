import { gsap, ScrollTrigger, lenis } from '../lib/scroll.js';
import { pillGroups } from '../data/content.js';
import wf1 from '../illustrations/wf1.html?raw';
import wf2 from '../illustrations/wf2.html?raw';
import wf3 from '../illustrations/wf3.html?raw';

/**
 * One pinned scene, scrubbed by scroll:
 *   1. gradient panel (80vw × 80vh) rises from below
 *   2. it expands into a full-viewport takeover; title + CTA fade in
 *   3. "space travel": pills come from the back (small, blurred) to the front
 *      for each knowledge group; the title swaps between groups, the CTA stays
 *   4. the gradient shrinks into the illustration panel of "What Ankar makes
 *      possible"; that section's copy rises in
 *   5. the three accordion phases are scrubbed (and clickable), then release
 */
const RISE = 600;
const EXPAND = 400;
const GROUP = 1100;
const SHRINK = 800;
const PHASE = 600;
const HOLD = 300;

const OFFSETS = [
  [-60, 110], [300, -40], [-560, -190], [220, 250], [-330, 90],
  [480, -250], [-120, -280], [560, 120], [-620, 280], [140, 60], [-260, -120], [420, 40],
];
const F = 640;      // focal length
const DZ = 520;     // depth between consecutive pills

export function initKnowledge() {
  const stage = document.getElementById('knowledge-stage');
  const bg = document.getElementById('tk-bg');
  const pillsEl = document.getElementById('tk-pills');
  const titlesEl = document.getElementById('tk-titles');
  const cta = document.getElementById('tk-cta');
  const possible = document.getElementById('possible');
  const placeholder = document.getElementById('possible-panel');
  const illus = document.getElementById('illus');
  if (!stage) return;

  // illustrations (self-contained HTML/CSS loops)
  const slots = illus.querySelectorAll('.illus__item');
  [wf1, wf2, wf3].forEach((html, i) => { slots[i].innerHTML = html; });

  // --- build titles + pills ------------------------------------------------
  const groups = pillGroups.map((g, gi) => {
    const title = document.createElement('h2');
    title.className = 'tk-title';
    title.textContent = g.title;
    titlesEl.appendChild(title);
    const pills = g.items.map((label, i) => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.innerHTML = `<span>${label}</span>`;
      el.style.display = 'none';
      pillsEl.appendChild(el);
      const [ox, oy] = OFFSETS[(i + gi * 3) % OFFSETS.length];
      return { el, ox, oy, z: F * 0.3 + i * DZ };
    });
    return { title, pills };
  });
  gsap.set(titlesEl.children, { xPercent: -50, yPercent: -100 }); // titles sit 50% higher than centre
  gsap.set(cta, { xPercent: -50, opacity: 1 });
  gsap.set(groups[0].title, { opacity: 1, scale: 0.8 }); // title + CTA are on the shape from the moment it rises (scaled to the 80% shape)

  const vw = () => stage.clientWidth;
  const vh = () => window.innerHeight;

  const targetRect = () => {
    const r = placeholder.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height };
  };

  const T_EXPAND = RISE;
  const T_GROUPS = RISE + EXPAND;
  const T_SHRINK = T_GROUPS + GROUP * groups.length;
  const T_PHASES = T_SHRINK + SHRINK;
  const TOTAL = T_PHASES + PHASE * 2 + HOLD;

  gsap.set(bg, { left: () => vw() * 0.1, top: () => vh(), width: () => vw() * 0.8, height: () => vh() * 0.8, borderRadius: 30 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: `+=${TOTAL}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (st) => update(st.progress * TOTAL),
      onRefresh: (st) => update(st.progress * TOTAL),
    },
  });

  // 1. rise
  tl.to(bg, { top: () => vh() * 0.1, duration: RISE, ease: 'power1.out' }, 0);
  // 2. expand
  tl.to(bg, { left: 0, top: 0, width: () => vw(), height: () => vh(), borderRadius: 0, duration: EXPAND, ease: 'power1.inOut' }, T_EXPAND);
  tl.to(groups[0].title, { scale: 1, duration: EXPAND, ease: 'power1.inOut' }, T_EXPAND);
  // 3. title swaps between groups
  groups.forEach((g, i) => {
    if (i === 0) return;
    const t = T_GROUPS + GROUP * i;
    tl.to(groups[i - 1].title, { y: -120, opacity: 0, duration: 220, ease: 'power2.in' }, t);
    tl.fromTo(g.title, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 220, ease: 'power2.out' }, t + 60);
  });
  // 4. shrink into the illustration panel
  tl.to(groups[groups.length - 1].title, { y: -120, opacity: 0, duration: 200, ease: 'power2.in' }, T_SHRINK);
  tl.to(cta, { opacity: 0, duration: 160 }, T_SHRINK);
  tl.to(bg, {
    left: () => targetRect().left,
    top: () => targetRect().top,
    width: () => targetRect().width,
    height: () => targetRect().height,
    borderRadius: 30,
    duration: SHRINK - 100,
    ease: 'power2.inOut',
  }, T_SHRINK + 100);
  tl.set(possible, { visibility: 'visible' }, T_SHRINK + 200);
  tl.to(possible.querySelectorAll('[data-tk-reveal]'), { y: 0, opacity: 1, duration: 320, stagger: 60, ease: 'power3.out' }, T_SHRINK + 320);
  tl.to(illus, { opacity: 1, duration: 200 }, T_SHRINK + SHRINK - 200);
  // pad the timeline to TOTAL so scroll distance maps 1:1 onto these px units
  tl.to({}, { duration: 1 }, TOTAL - 1);

  // --- pills: fake 3D travel ------------------------------------------------
  let lastGroup = -1;
  function update(px) {
    const inGroups = px >= T_GROUPS && px < T_SHRINK + 220;
    const gi = Math.min(groups.length - 1, Math.max(0, Math.floor((px - T_GROUPS) / GROUP)));
    if (gi !== lastGroup || !inGroups) {
      groups.forEach((g, i) => g.pills.forEach((p) => { p.el.style.display = inGroups && i === gi ? '' : 'none'; }));
      lastGroup = inGroups ? gi : -1;
    }
    if (!inGroups) return;
    const g = groups[gi];
    const local = Math.min(1, Math.max(0, (px - T_GROUPS - gi * GROUP) / GROUP));
    const zEnd = g.pills[g.pills.length - 1].z + F * 0.55;
    const cam = local * zEnd;
    const fade = px > T_SHRINK ? Math.max(0, 1 - (px - T_SHRINK) / 200) : 1;
    const cx = vw() / 2;
    const cy = vh() / 2;
    g.pills.forEach((p) => {
      const d = p.z - cam;
      if (d <= -F * 0.72) { p.el.style.opacity = 0; return; }
      const s = F / (F + d);
      const blur = d > 0 ? Math.min(12, d / 210) : Math.min(10, -d / 45);
      const oIn = Math.min(1, Math.max(0, (3400 - d) / 1000));
      const oOut = d < -60 ? Math.max(0, 1 - (-d - 60) / 320) : 1;
      p.el.style.opacity = (oIn * oOut * fade).toFixed(3);
      p.el.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : 'none';
      p.el.classList.toggle('is-front', s > 0.78); // only the nearly-arrived pills pass in front of the title
      p.el.style.transform = `translate(${(cx + p.ox * s).toFixed(1)}px, ${(cy + p.oy * s).toFixed(1)}px) translate(-50%, -50%) scale(${s.toFixed(4)})`;
    });
  }

  // --- accordion phases -----------------------------------------------------
  const items = Array.from(document.querySelectorAll('#possible-acc .acc__item'));
  let phase = 0;
  function setPhase(i, immediate) {
    phase = i;
    items.forEach((item, idx) => {
      const open = idx === i;
      item.classList.toggle('is-open', open);
      const panel = item.querySelector('.acc__panel');
      const h = open ? item.querySelector('.acc__body').offsetHeight : 0;
      gsap.to(panel, { height: h, duration: immediate ? 0 : 0.6, ease: 'power3.inOut' });
    });
    slots.forEach((s, idx) => s.classList.toggle('is-on', idx === i));
  }
  setPhase(0, true);

  const st = tl.scrollTrigger;
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
      if (st.isActive) {
        lenis.scrollTo(st.start + T_PHASES + PHASE * i + 40, { duration: 1 });
      }
      setPhase(i);
    });
  });
}
