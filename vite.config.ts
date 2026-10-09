import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    sourcemap: false, // Security: Never emit production source maps
    target: 'es2020',
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('three')) {
            return 'three-bundle';
          }
          if (id.includes('@react-three')) {
            return 'fiber-bundle';
          }
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
