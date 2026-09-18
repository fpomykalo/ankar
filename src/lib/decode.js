/**
 * Decode every image once the page is idle, one at a time. Decoding a large photo on demand,
 * the moment its reveal fires, freezes the main thread for a frame or more; decoded ahead
 * of time it is free.
 */
export function primeImages() {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  const run = () => {
    const imgs = Array.from(document.images);
    const next = () => {
      const img = imgs.shift();
      if (!img) return;
      const go = () => img.decode().catch(() => {}).then(() => idle(next));
      img.complete ? go() : img.addEventListener('load', go, { once: true });
    };
    next();
  };
  if (document.readyState === 'complete') idle(run);
  else window.addEventListener('load', () => idle(run), { once: true });
}
