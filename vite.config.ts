import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/internal/',                 // we serve the app under /internal
  build: {
    outDir: 'dist/internal',          // put index.html at dist/internal/index.html
    copyPublicDir: true               // copy everything from /public into dist/internal
  }
})
