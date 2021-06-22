import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: '8000',
    open: true,
    proxy: {
      '/api': {
        target: 'http://api.ifbes.com/mock/20/api',
        changeOrigin: true,
        rewrite: (path) => path.replace('^/api', '')
      }
    }
  }
});
