import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

    console.log('Environment variables:', {
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL,
    VITE_RECAPTCHA_SITE_KEY: process.env.VITE_RECAPTCHA_SITE_KEY
  });

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
      host: '0.0.0.0',
      strictPort: true,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 0,
      assetsDir: 'assets',
    },
   define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
      // Make environment variables available in client code
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(process.env.VITE_BACKEND_URL),
      "import.meta.env.VITE_RECAPTCHA_SITE_KEY": JSON.stringify(process.env.VITE_RECAPTCHA_SITE_KEY),
    },
    base: "/", 
  };
});