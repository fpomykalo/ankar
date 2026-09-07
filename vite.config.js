import { defineConfig } from 'vite';

// VITE_BASE lets the same build serve from a sub-path (GitHub Pages uses /ankar/).
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  server: { port: 5173, host: true },
  build: { target: 'es2020' },
});
