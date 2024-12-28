import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    mimeTypes: {
      'application/javascript': ['js', 'jsx'], // Add jsx here
    },
  },
})
