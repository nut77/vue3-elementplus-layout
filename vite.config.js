import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import {injectHtml} from 'vite-plugin-html';
const path = require('path');

const env = loadEnv('', process.cwd());
export default defineConfig({
  plugins: [
    vue(),
    injectHtml({
      injectData: {...env}
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@a': path.resolve(__dirname, './src/assets'),
      '@p': path.resolve(__dirname, './src/pages'),
      '@c': path.resolve(__dirname, './src/components'),
      '@l': path.resolve(__dirname, './src/layout')
    }
  },
  server: {
    host: '0.0.0.0',
    port: '8000',
    // open: true,
    proxy: {
      '/api': {
        target: 'http://api.ifbes.com/mock/20/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@a/styles/variable.less";`
      }
    }
  }
});
