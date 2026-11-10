import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    // Explicit imports (`import { describe, it, expect } from 'vitest'`) instead of
    // globals: ambient test globals would need `types: [...]` in tsconfig.json,
    // which switches off automatic `@types/*` inclusion for the whole project.
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    // Scoped deliberately: Vitest's default glob would also collect the
    // Playwright specs under e2e/, which need a browser and a running server.
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}', 'tests/integration/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/core/**', 'src/application/**', 'src/infrastructure/**', 'src/presentation/**'],
      exclude: ['**/generated/**', '**/*.d.ts'],
    },
  },
});
