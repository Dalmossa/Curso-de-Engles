'use client';

import { useTheme } from '../providers/theme-provider';
import { Button } from './ui/button';

/**
 * The button is rendered on the server too, and `theme` is `null` there, so the label is
 * chosen to be true in both states ("Alternar tema") rather than flickering between
 * "Tema claro" and "Tema escuro" on hydration.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title="Alternar tema"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
      <span className="hidden sm:inline">Tema</span>
    </Button>
  );
}
