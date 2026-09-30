import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace(/\\/g, '/');

function resolveTsFromJs(): Plugin {
  return {
    name: 'resolve-ts-from-js',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.endsWith('.js') && importer) {
        const resolved = path.resolve(path.dirname(importer), source);
        const tsPath = resolved.slice(0, -3) + '.ts';
        if (fs.existsSync(tsPath)) return tsPath;
        const tsxPath = resolved.slice(0, -3) + '.tsx';
        if (fs.existsSync(tsxPath)) return tsxPath;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [resolveTsFromJs(), react()],
  root: 'client',
  resolve: {
    alias: {
      '@client': `${__dirname}/client/src`,
      '@shared': `${__dirname}/shared/index.ts`,
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [__dirname],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: `${__dirname}/dist/client`,
    emptyOutDir: true,
  },
});
