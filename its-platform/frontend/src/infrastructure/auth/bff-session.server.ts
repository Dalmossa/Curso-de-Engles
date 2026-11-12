import 'server-only';

import { NextResponse } from 'next/server';
import {
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_ID_COOKIE,
  SESSION_LEARNER_COOKIE,
  SESSION_TOKEN_COOKIE,
} from '@/shared/auth-cookies';

/**
 * Everything the auth route handlers share.
 *
 * The BFF is the only party that sees both the API's session payload and the browser. Keeping the
 * cookie names, the URL construction and the "is this a session?" check here means the login,
 * register and logout handlers cannot each answer those questions differently — which is exactly
 * what the login loop was: a writer that stored `refresh_token` and a reader that looked for
 * `its_session`.
 */

export interface AuthSessionUser {
  readonly id: string;
  readonly email?: string;
  readonly displayName?: string | null;
  readonly learnerId?: string | null;
  readonly emailVerified?: boolean;
  readonly provider?: string;
}

export interface AuthSessionPayload {
  readonly sessionId: string;
  readonly token: string;
  readonly accessToken?: string;
  readonly expiresAt?: string;
  readonly user: AuthSessionUser;
}

/** `ITS_API_BASE_URL` already carries `/api/v1`; the defaults keep a fresh clone working. */
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

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * A response is a session only when it carries the identifiers the cookies need. `accessToken` is
 * optional so an older API build (which returned only the refresh `token`) still logs the user in
 * — the token is then the refresh token, which the proxy accepts but the API will refuse; the UI
 * surfaces that as an inactive session rather than as a redirect loop.
 */
export function isAuthSessionPayload(value: unknown): value is AuthSessionPayload {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const user = candidate['user'];
  if (typeof user !== 'object' || user === null) return false;

  return (
    nonEmptyString(candidate['sessionId']) &&
    nonEmptyString(candidate['token']) &&
    nonEmptyString((user as Record<string, unknown>)['id']) &&
    (candidate['accessToken'] === undefined || nonEmptyString(candidate['accessToken']))
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  };
}

export function applySessionCookies(response: NextResponse, payload: AuthSessionPayload): void {
  const learnerId =
    nonEmptyString(payload.user.learnerId) ? payload.user.learnerId : payload.user.id;

  response.cookies.set({ name: SESSION_ID_COOKIE, value: payload.sessionId, ...cookieOptions() });
  response.cookies.set({
    name: SESSION_TOKEN_COOKIE,
    value: payload.accessToken ?? payload.token,
    ...cookieOptions(),
  });
  response.cookies.set({ name: SESSION_LEARNER_COOKIE, value: learnerId, ...cookieOptions() });
}

export function clearSessionCookies(response: NextResponse): void {
  for (const name of [SESSION_ID_COOKIE, SESSION_TOKEN_COOKIE, SESSION_LEARNER_COOKIE]) {
    response.cookies.set({ name, value: '', path: '/', maxAge: 0 });
  }
}

/** `fetch` to the API with a deadline; the BFF must not hang the browser on a dead backend. */
export async function apiFetch(path: string, init: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
}
