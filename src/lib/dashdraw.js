/**
 * Drives the stroke-dashoffset keyframes of an illustration from JavaScript.
 *
 * The illustrations draw their lines through SVG masks whose paths animate with CSS keyframes.
 * WebKit (Safari on the iPhone) regenerates a mask image whenever the masked content repaints and
 * restarts the CSS animations inside it, so the lines were drawn, wiped and drawn again. Setting the
 * offsets from a requestAnimationFrame loop gives the mask a fresh, correct value on every frame,
 * and measuring the real path length removes the dependence on `pathLength` support.
 * Only the dash keyframes are driven; opacity and transform animations stay in CSS.
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

/** Takes over every dash animation inside `root` (an inserted illustration). Returns a stop function. */
export function driveDashAnimations(root) {
  const css = Array.from(root.querySelectorAll('style')).map((s) => s.textContent).join('\n');
  const frames = parseKeyframes(css);
  const runs = [];
  root.querySelectorAll('[style*="animation"]').forEach((el) => {
    const name = el.style.animationName;
    const stops = frames[name];
    if (!stops) return;
    const duration = parseFloat(el.style.animationDuration) * (el.style.animationDuration.endsWith('ms') ? 1 : 1000) || 4000;
    el.style.animation = 'none';
    // real length instead of pathLength=1: the keyframe values are fractions of the path
    let scale = 1;
    if (el.hasAttribute('pathLength') && typeof el.getTotalLength === 'function') {
      try { scale = el.getTotalLength() || 1; } catch { scale = 1; }
      el.removeAttribute('pathLength');
      el.setAttribute('stroke-dasharray', String(scale));
    }
    runs.push({ el, stops, duration, scale });
  });
  if (!runs.length) return () => {};
  const at = (stops, t) => {
    if (t <= stops[0].p) return stops[0].v;
    for (let i = 0; i < stops.length - 1; i += 1) {
      const a = stops[i];
      const b = stops[i + 1];
      if (t <= b.p) { const span = b.p - a.p; const k = span > 0 ? a.ease((t - a.p) / span) : 1; return a.v + (b.v - a.v) * k; }
    }
    return stops[stops.length - 1].v;
  };
  const start = performance.now();
  let raf = 0;
  let done = false;
  const tick = (now) => {
    let live = false;
    runs.forEach((r) => {
      const t = Math.min(1, (now - start) / r.duration);
      r.el.style.strokeDashoffset = `${at(r.stops, t) * r.scale}`;
      if (t < 1) live = true;
    });
    if (live && !done) raf = requestAnimationFrame(tick);
  };
  runs.forEach((r) => { r.el.style.strokeDashoffset = `${at(r.stops, 0) * r.scale}`; });
  raf = requestAnimationFrame(tick);
  return () => { done = true; cancelAnimationFrame(raf); };
}
