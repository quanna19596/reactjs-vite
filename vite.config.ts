import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, ModuleNode, PluginOption } from 'vite';
import eslint from 'vite-plugin-eslint';

const SPLIT_CSS_MARK = '/* ##SPLIT_CSS_MARK## */';

const hotReload = (): PluginOption => ({ // // A plugin for hot module error for cannot access xxx before initialization.
  name: 'singleHMR',
  handleHotUpdate({ modules }): ModuleNode[] {
    modules.map((m) => ({
      ...m,
      importedModules: new Set(),
      importers: new Set(),
    }));

    return modules;
  }
});

const removeDuplicatedStyles = (): { name: string; transform(src: string, id: any): { code: string; map: any } } => ({
  name: 'vite-plugin-strip-css',
  transform: (src: string, id): { code: string; map: any } => {
    if (id.includes('.scss')) {
      if (id.includes('src/index.scss')) {
        return { code: src, map: null };
      }

      const split = src.split(SPLIT_CSS_MARK);
      const newSrc = split[split.length - 1];
      return { code: newSrc, map: null };
    }
  }
});

export default defineConfig({
  plugins: [react(), eslint(), hotReload(), removeDuplicatedStyles()],
  server: {
    port: 3003
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.scss";${SPLIT_CSS_MARK}`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
