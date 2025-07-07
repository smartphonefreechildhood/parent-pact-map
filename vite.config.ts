import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/smartphonefreechildhood-map/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/index.js`,
        chunkFileNames: `assets/chunk.js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  plugins: [react(), tailwindcss()],
});
