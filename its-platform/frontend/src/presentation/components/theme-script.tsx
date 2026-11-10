import { THEME_STORAGE_KEY } from '@/shared/constants';

/**
 * Runs before the first paint so the page never flashes the wrong theme.
 *
 * Inline because it has to execute ahead of the bundle; the production CSP in
 * `next.config.ts` allows `'unsafe-inline'` for `script-src` precisely so this can. The
 * script is a fixed string built here — nothing interpolated from a request reaches it,
 * so there is no injection surface.
 *
 * `<html>` is given `suppressHydrationWarning` in the layout because this script writes
 * `class` and `data-theme` before React hydrates, and React would otherwise report the
 * server's attributes as mismatched.
 */
export function ThemeScript() {
  const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=(s==="light"||s==="dark")?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.dataset.theme=t;}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
