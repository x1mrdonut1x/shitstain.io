import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
