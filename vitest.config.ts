import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Vite config'in üstüne test ayarlarını overlay et (alias'lar otomatik gelir).
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/tests/setup.ts', '**/*.config.{ts,js}', 'src/main.tsx'],
      },
    },
  }),
);
