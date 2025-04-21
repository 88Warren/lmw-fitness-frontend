import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
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
          target: isProduction 
            ? 'http://api.lmwfitness.co.uk' 
            : 'http://localhost:8082',
          changeOrigin: true,
        },
        '/images': {
          target: isProduction 
            ? 'http://api.lmwfitness.co.uk' 
            : 'http://localhost:8082',
          changeOrigin: true,
        },
      },
      port: 5052,
      host: '0.0.0.0',
      strictPort: true,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 0,
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    base: "/", 
  };
});