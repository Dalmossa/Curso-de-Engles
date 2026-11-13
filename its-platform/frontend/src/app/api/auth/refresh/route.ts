import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_ID_COOKIE,
  SESSION_REFRESH_COOKIE,
  SESSION_TOKEN_COOKIE,
} from '@/shared/auth-cookies';
import { isAccessTokenExpired, refreshSession } from '@/infrastructure/auth/session-refresh.server';

/**
 * Server-side renewal endpoint.
 *
 * The proxy already refreshes on navigation, but a long-lived page (a practice session that keeps
 * a Server Action firing for more than 15 minutes) never navigates. This handler gives the client
 * the same exchange without exposing the refresh token to JavaScript — it reads the httpOnly
 * cookie and rotates it here.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const sessionId = req.cookies.get(SESSION_ID_COOKIE)?.value;
  const accessToken = req.cookies.get(SESSION_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(SESSION_REFRESH_COOKIE)?.value;

  if (!sessionId || !refreshToken) {
    return NextResponse.json({ ok: false, reason: 'no_session' }, { status: 401 });
  }

  if (accessToken !== undefined && !isAccessTokenExpired(accessToken)) {
    return NextResponse.json({ ok: true, refreshed: false });
  }

  const rotated = await refreshSession(sessionId, refreshToken);
  if (rotated === null) {
    const response = NextResponse.json({ ok: false, reason: 'rejected' }, { status: 401 });
    for (const name of [SESSION_ID_COOKIE, SESSION_TOKEN_COOKIE, SESSION_REFRESH_COOKIE]) {
      response.cookies.set({ name, value: '', path: '/', maxAge: 0 });
    }
    return response;
  }

  const response = NextResponse.json({ ok: true, refreshed: true });
  const options = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  };
  response.cookies.set({ name: SESSION_TOKEN_COOKIE, value: rotated.accessToken, ...options });
  response.cookies.set({ name: SESSION_REFRESH_COOKIE, value: rotated.refreshToken, ...options });
  return response;
}
