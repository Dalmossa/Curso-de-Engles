/**
 * A redirect target that cannot leave this origin.
 *
 * The proxy puts the blocked path in `?next=` and the BFF honours it after a successful login, so
 * the value is attacker-controlled. `//evil.example` is a protocol-relative URL that browsers
 * follow off-site, and `/\evil.example` is the same trick after normalisation; neither starts with
 * a single `/` followed by a path segment, so both are refused here. A backslash is refused
 * outright because proxy and browser disagree about what it means.
 */
export function safeRedirectPath(value: unknown, fallback = '/'): string {
  if (typeof value !== 'string') return fallback;

  const path = value.trim();
  if (path.length === 0 || path.length > 2048) return fallback;
  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//')) return fallback;
  if (path.includes('\\')) return fallback;
  // Control characters have no business in a path and are a header-injection shape.
  if (/[\u0000-\u001f\u007f]/.test(path)) return fallback;

  return path;
}
