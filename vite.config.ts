import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// =============================================================================
// Vite config — React + path alias'lar + dev proxy
// =============================================================================
// Path alias'lar tsconfig.app.json ile birebir eşleşmeli — IDE intellisense bozulmasın.
// Dev proxy: /api → backend (http://localhost:5005). CORS sıkıntısı yaşamamak için.
// =============================================================================
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1024,
  },
});
