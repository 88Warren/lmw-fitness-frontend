import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        // target: 'http://backend-service:8080',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:8082',
        // target: 'http://backend-service:8080',
      }
    },
    port: 5052,
    host: '0.0.0.0',
    strictPort: true,
  },
})


