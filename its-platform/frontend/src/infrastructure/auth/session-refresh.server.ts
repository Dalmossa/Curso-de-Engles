import { apiUrl } from '@/shared/api-url';

/**
 * Exchanging the refresh token for a new access token.
 *
 * The API rotates the refresh token on every exchange and treats a *second* use of the old one as
 * reuse — which revokes the session. A browser opening a page issues several requests (document,
 * RSC payload, prefetch) and they all carry the same expired cookies, so concurrent exchanges are
 * the normal case, not the edge case. The in-memory single-flight below collapses them into one
 * call per process; the API's own reuse detection stays the backstop.
 */

export interface RotatedSession {
  readonly sessionId: string;
  readonly accessToken: string;
  readonly refreshToken: string;
}

const inflight = new Map<string, Promise<RotatedSession | null>>();

/** `null` when the token is opaque or malformed — the API, not this module, is the verifier. */
export function accessTokenExpiresAt(token: string): number | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    // `atob`/`TextDecoder` rather than `Buffer`: this module also runs in the proxy, where Node
    // globals are not guaranteed. The base64url alphabet is normalised to base64 first.
    const base64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as { exp?: unknown };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** True only when the token declares an expiry that has passed. Unknown tokens are left alone. */
export function isAccessTokenExpired(token: string, skewMs = 0): boolean {
  const expiresAt = accessTokenExpiresAt(token);
  if (expiresAt === null) return false;
  return Date.now() >= expiresAt - skewMs;
}

async function exchange(sessionId: string, refreshToken: string): Promise<RotatedSession | null> {
  let response: Response;
  try {
    response = await fetch(apiUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, refresh_token: refreshToken }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  const accessToken = body?.['access_token'];
  const rotatedToken = body?.['refresh_token'];
  if (typeof accessToken !== 'string' || typeof rotatedToken !== 'string') return null;
  if (accessToken.length === 0 || rotatedToken.length === 0) return null;

  return { sessionId, accessToken, refreshToken: rotatedToken };
}

export async function refreshSession(
  sessionId: string,
  refreshToken: string,
): Promise<RotatedSession | null> {
  // The refresh token itself is never used as a map key: a short suffix identifies the exchange
  // for logging-free deduplication without keeping the credential in another place.
  const key = `${sessionId}:${refreshToken.slice(-16)}`;
  const pending = inflight.get(key);
  if (pending !== undefined) return pending;

  const task = exchange(sessionId, refreshToken).finally(() => inflight.delete(key));
  inflight.set(key, task);
  return task;
}
