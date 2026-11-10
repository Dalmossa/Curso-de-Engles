'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { THEME_STORAGE_KEY } from '@/shared/constants';
import { readStoredValue, writeStoredValue } from '@/shared/utils/storage';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  /** `null` before the client has observed the DOM — see the note on `useSyncExternalStore` below. */
  readonly theme: Theme | null;
  readonly setTheme: (theme: Theme) => void;
  readonly toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
}

/**
 * The theme is read from the DOM rather than mirrored in React state.
 *
 * The inline `ThemeScript` in the layout has already painted the right theme before React
 * hydrates. Mirroring that into `useState` would mean a `setState` inside an effect — a
 * cascading render on every mount — so the DOM stays the single source of truth and React
 * subscribes to it with `useSyncExternalStore`. `getServerSnapshot` returns `null`, which is
 * both accurate (the server has no DOM) and what makes hydration a no-op: the server's
 * markup and the client's first pass agree before the store re-reads.
 */
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): null {
  return null;
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function resolveInitialTheme(): Theme {
  const stored = readStoredValue(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    writeStoredValue(THEME_STORAGE_KEY, next);
    emit();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return context;
}
