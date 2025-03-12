import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/", // Change this if deploying to a subfolder (e.g., "/app/")
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: "dist", 
    sourcemap: false, 
    chunkSizeWarningLimit: 500, 
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"), 
  },
  server: {
    port: 5052,
    host: '0.0.0.0',
    strictPort: true,
  }
})