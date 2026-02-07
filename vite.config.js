import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    proxy: {
      '/v1.1': {
        target: 'https://api.switch-bot.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        quality: resolve(__dirname, 'quality.html'),
        consultation: resolve(__dirname, 'consultation.html'),
        guide: resolve(__dirname, 'guide.html'),
        feedingGuide: resolve(__dirname, 'feeding-guide.html'),
        feederDatabase: resolve(__dirname, 'feeder-database.html'),
      },
    },
  },
});
