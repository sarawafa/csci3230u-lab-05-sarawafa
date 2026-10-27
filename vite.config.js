import { defineConfig } from 'vite'

// This is a two-page site, so tell Vite about both HTML entry points
// (otherwise `vite build` only bundles index.html).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        scores: 'high_scores.html',
      },
    },
  },
})
