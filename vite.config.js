import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  // console.log('Vite Mode:', mode);

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
            ? 'https://api.lmwfitness.co.uk' 
            : 'http://localhost:8082',
          changeOrigin: true,
        },
        '/images': {
          target: isProduction 
            ? 'https://api.lmwfitness.co.uk' 
            : 'http://localhost:8082',
          changeOrigin: true,
        },
      },
      port: 5052,
      // host: '0.0.0.0',
      host: true,
      strictPort: true,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '.ngrok-free.app',
      ]
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 0,
      assetsDir: 'assets',
    },
    base: "/", 
  };
});