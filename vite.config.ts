import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    port: 3000
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '@/styles/fonts.scss';
          @import '@/styles/mixins.scss';
          @import '@/styles/colors.scss';
          @import '@/styles/constants.scss';
          @import '@/styles/main-classes.scss';
          @import "@/styles/global.scss";
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
