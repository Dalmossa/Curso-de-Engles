/**
 * The API base URL, shared by the BFF handlers and the proxy.
 *
 * Both need it and neither may disagree: a proxy that refreshes against a different origin than
 * the one the route handlers log in to would rotate a session nobody uses.
 *
 * `ITS_API_BASE_URL` already carries `/api/v1`; the default keeps a fresh clone working.
 */
export function apiBaseUrl(): string {
  const configured = process.env.ITS_API_BASE_URL?.trim();
  return (configured && configured.length > 0 ? configured : 'http://localhost:3000/api/v1').replace(
    /\/+$/,
    '',
  );
}

export function apiUrl(path: string): string {
  return `${apiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}
