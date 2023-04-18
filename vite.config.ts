import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, ModuleNode, PluginOption } from 'vite';
import eslint from 'vite-plugin-eslint';

const hotReload = (): PluginOption => ({
  name: 'singleHMR',
  handleHotUpdate({ modules }): ModuleNode[] {
    modules.map((m) => {
      m.importedModules = new Set();
      m.importers = new Set();
    });

    return modules;
  }
});

export default defineConfig({
  plugins: [react(), eslint(), hotReload()],
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
