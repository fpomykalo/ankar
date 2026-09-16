/**
 * Draws an illustration's lines from JavaScript instead of CSS keyframes.
 *
 * The illustrations reveal their dashed lines through SVG masks: a solid stroke inside a <mask> draws in
 * with animated stroke-dashoffset keyframes. WebKit (Safari, and every browser on the iPhone) renders an
 * animated dash offset inside a mask wrongly: the line drew in, wiped and drew in again. So the masks are
 * dropped altogether: the dashed line's own dash array is rebuilt every frame so that only the revealed
 * part of it carries dashes, which needs no mask and no dash offset animation at all. The unmasked lines
 * (arrows, the check mark) keep their offset animation, driven from the same loop off the real path length.
 * Opacity and transform animations stay in CSS.
 */
const bezier = (x1, y1, x2, y2) => {
  const a = (a1, a2) => 1 - 3 * a2 + 3 * a1;
  const b = (a1, a2) => 3 * a2 - 6 * a1;
  const c = (a1) => 3 * a1;
  const calc = (t, a1, a2) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
  const slope = (t, a1, a2) => 3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i += 1) { const s = slope(t, x1, x2); if (s === 0) break; t -= (calc(t, x1, x2) - x) / s; }
    return calc(t, y1, y2);
  };
};
const easings = { linear: (x) => x, ease: bezier(0.25, 0.1, 0.25, 1), 'ease-in': bezier(0.42, 0, 1, 1), 'ease-out': bezier(0, 0, 0.58, 1), 'ease-in-out': bezier(0.42, 0, 0.58, 1) };
const easingOf = (s) => {
  if (!s) return easings.linear;
  const m = s.match(/cubic-bezier\(([^)]+)\)/);
  if (m) { const [x1, y1, x2, y2] = m[1].split(',').map(Number); return bezier(x1, y1, x2, y2); }
  return easings[s.trim()] || easings.linear;
};

/** The stroke-dashoffset stops of every @keyframes block in a style text: { name: [{ p, v, ease }] } */
function parseKeyframes(css) {
  const out = {};
  const re = /@keyframes\s+([\w-]+)\s*\{/g;
  let m;
  while ((m = re.exec(css))) {
    let depth = 1;
    let i = re.lastIndex;
    while (i < css.length && depth) { if (css[i] === '{') depth += 1; else if (css[i] === '}') depth -= 1; i += 1; }
    const body = css.slice(re.lastIndex, i - 1);
    const stops = [];
    for (const s of body.matchAll(/([\d.%,\s]+)\{([^}]*)\}/g)) {
      const v = s[2].match(/stroke-dashoffset\s*:\s*(-?[\d.]+)/);
      if (!v) continue;
      const tf = s[2].match(/animation-timing-function\s*:\s*([^;]+)/);
      s[1].split(',').forEach((p) => stops.push({ p: parseFloat(p) / 100, v: parseFloat(v[1]), ease: easingOf(tf && tf[1]) }));
    }
    if (stops.length) out[m[1]] = stops.sort((a, b) => a.p - b.p);
    re.lastIndex = i;
  }
  return out;
}

/** The keyframe value at time fraction t, eased between stops. */
const at = (stops, t) => {
  if (t <= stops[0].p) return stops[0].v;
  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t <= b.p) { const span = b.p - a.p; const k = span > 0 ? a.ease((t - a.p) / span) : 1; return a.v + (b.v - a.v) * k; }
  }
  return stops[stops.length - 1].v;
};

const durationOf = (el) => parseFloat(el.style.animationDuration) * (el.style.animationDuration.endsWith('ms') ? 1 : 1000) || 4000;
const lengthOf = (el) => { try { return (typeof el.getTotalLength === 'function' && el.getTotalLength()) || 0; } catch { return 0; } };

/**
 * A dashed stroke (pattern like "2 4", anchored at the path start) showing only between A and B along the path:
 * the dash array lists just the dashes inside that window, and a huge gap hides the rest.
 * The window is what a dash array of [1, 1] on pathLength=1 with offset `o` would show: from -o to the end
 * for a negative offset (drawing from the far end), from the start to 1 - o for a positive one.
 */
function windowDashes(el, pattern, L, A, B) {
  const T = pattern.reduce((s, v) => s + v, 0);
  const ivs = [];
  for (let x = Math.floor(A / T) * T; x < B; ) {
    for (let k = 0; k < pattern.length; k += 2) {
      const s = Math.max(x, A);
      const e = Math.min(x + pattern[k], B);
      if (e - s > 0.05) ivs.push([s, e]);
      x += pattern[k] + pattern[k + 1];
    }
  }
  if (!ivs.length) { el.style.visibility = 'hidden'; return; }
  const arr = [];
  ivs.forEach(([s, e], i) => { arr.push(e - s); if (i < ivs.length - 1) arr.push(ivs[i + 1][0] - e); });
  arr.push(L * 4 + 1000);
  el.setAttribute('stroke-dasharray', arr.map((v) => v.toFixed(2)).join(' '));
  el.style.strokeDashoffset = `${-ivs[0][0]}`;
  el.style.visibility = '';
}

/** Takes over every dash animation inside `root` (a freshly inserted illustration). Returns a stop function. */
export function driveDashAnimations(root) {
  const css = Array.from(root.querySelectorAll('style')).map((s) => s.textContent).join('\n');
  const frames = parseKeyframes(css);
  const runs = [];
  // masked lines: the mask goes, the dashed line reveals itself
  root.querySelectorAll('mask').forEach((mask) => {
    const src = mask.querySelector('[style*="animation"]');
    const stops = src && frames[src.style.animationName];
    const target = root.querySelector(`[mask="url(#${mask.id})"]`);
    if (!stops || !target) return;
    let pattern = (target.getAttribute('stroke-dasharray') || '').split(/[\s,]+/).map(Number).filter((v) => !Number.isNaN(v));
    if (!pattern.length) return; // a solid line under a mask would need the mask
    if (pattern.length % 2) pattern = pattern.concat(pattern);
    const L = lengthOf(target);
    if (!L) return;
    target.removeAttribute('mask');
    mask.remove();
    runs.push({ el: target, stops, duration: durationOf(src), pattern, L, reveal: true });
  });
  // plain lines drawn by their own offset (arrows, the check mark): the real length replaces pathLength=1
  root.querySelectorAll('[style*="animation"]').forEach((el) => {
    const stops = frames[el.style.animationName];
    if (!stops) return;
    const duration = durationOf(el);
    el.style.animation = 'none';
    let scale = 1;
    if (el.hasAttribute('pathLength')) {
      scale = lengthOf(el) || 1;
      el.removeAttribute('pathLength');
      el.setAttribute('stroke-dasharray', String(scale));
    }
    runs.push({ el, stops, duration, scale });
  });
  if (!runs.length) return () => {};
  const apply = (r, t) => {
    const o = at(r.stops, t);
    if (!r.reveal) { r.el.style.strokeDashoffset = `${o * r.scale}`; return; }
    const a = o <= 0 ? -o : 0;
    const b = o <= 0 ? 1 : 1 - o;
    windowDashes(r.el, r.pattern, r.L, a * r.L, b >= 1 ? r.L + 1 : b * r.L);
  };
  const start = performance.now();
  let raf = 0;
  let done = false;
  const tick = (now) => {
    let live = false;
    runs.forEach((r) => {
      const t = Math.min(1, (now - start) / r.duration);
      apply(r, t);
      if (t < 1) live = true;
    });
    if (live && !done) raf = requestAnimationFrame(tick);
  };
  runs.forEach((r) => apply(r, 0));
  raf = requestAnimationFrame(tick);
  return () => { done = true; cancelAnimationFrame(raf); };
}
