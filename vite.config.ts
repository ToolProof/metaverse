import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    open: true,
  },
  preview: {
    open: true,
  },
  build: {
    outDir: 'site',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
});
