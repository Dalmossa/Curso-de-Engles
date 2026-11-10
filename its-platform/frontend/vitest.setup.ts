import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

/**
 * Tests under `tests/unit/core/**` opt into the `node` environment with a
 * `@vitest-environment node` docblock — that keeps the "core/ is DOM-free" claim
 * falsifiable instead of aspirational. Everything DOM-shaped is therefore
 * guarded on `typeof window` so the shared setup file can serve both.
 */
const hasDom = typeof window !== 'undefined';

if (hasDom) {
  // jsdom implements neither API, and Radix UI primitives touch both.
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
}

afterEach(async () => {
  if (!hasDom) return;
  const { cleanup } = await import('@testing-library/react');
  cleanup();
});
