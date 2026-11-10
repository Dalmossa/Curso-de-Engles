/**
 * `localStorage`, guarded.
 *
 * Two failure modes are normal rather than exceptional and must not take a render down:
 * there is no `window` (a Server Component importing this module), or the browser refuses
 * access (Safari private mode, a storage policy in an iframe). Both are reported as "no
 * stored value", which is what every caller already handles.
 *
 * Lives in `shared/` rather than `infrastructure/` because it is a dependency-free browser
 * utility, and because the alternative — a second exception in the layer lint rule — would
 * weaken the rule that keeps components away from the HTTP layer. The theme is the only
 * thing stored here; answers and progress stay server-side.
 */
export function readStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStoredValue(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota exceeded, or a blocked storage area: the preference simply does not persist.
  }
}
