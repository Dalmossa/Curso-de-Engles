import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_ID_COOKIE,
  SESSION_LEARNER_COOKIE,
  SESSION_REFRESH_COOKIE,
  SESSION_TOKEN_COOKIE,
} from '@/shared/auth-cookies';
import {
  isAccessTokenExpired,
  refreshSession,
  type RotatedSession,
} from '@/infrastructure/auth/session-refresh.server';

/**
 * Next.js 16 calls this file `proxy` (it was `middleware`). It runs before a protected route is
 * rendered and gates navigation on the session cookies.
 *
 * Two jobs, in this order:
 *
 * 1. **Optimistic gate** — no session cookies means the server component has no credential to
 *    present. Redirect to `/login` before rendering rather than let the page discover a `401`.
 * 2. **Renewal** — the access token lives 15 minutes; the refresh token lives 30 days. When the
 *    access token has expired and a refresh token exists, exchange it here and pass the new one to
 *    both the browser (Set-Cookie) and the render (rewritten `cookie` header). Refreshing in the
 *    proxy is deliberate: a Server Component cannot write cookies during render, so this is the
 *    only place in the request that can persist the rotated credential.
 *
 * It still does not *verify* the token — the API is the only party that can decide, and a proxy
 * that duplicated verification would be a second answer to a security question.
 *
 * `/login` and `/register` are never redirected away from, even with a session: a token the API no
 * longer accepts must not leave the learner unable to reach the form that replaces it. The password
 * recovery screens (`/forgot-password`, `/reset-password`) are public for the same reason — the
 * person who forgot the password is, by definition, not signed in.
 *
 * `/account` **is** protected: it is the learner's own data, their e-mail and their LGPD
 * rights. A screen that shows somebody's e-mail without a session is a leak, and the gate
 * is the only thing that stands between the URL and the account.
 */
const PROTECTED = ['/', '/mastery', '/lessons', '/diagnostic', '/account'];
const PUBLIC = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
  '/api/health',
  '/health',
];

function matches(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((path) => pathname === path || pathname.startsWith(`${path}/`));
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

function loginRedirect(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(url);
}

function redirectAndClear(req: NextRequest): NextResponse {
  const response = loginRedirect(req);
  for (const name of [SESSION_ID_COOKIE, SESSION_TOKEN_COOKIE, SESSION_REFRESH_COOKIE, SESSION_LEARNER_COOKIE]) {
    response.cookies.set({ name, value: '', path: '/', maxAge: 0 });
  }
  return response;
}

/**
 * Hand the rotated token to the render happening in this same request. `Set-Cookie` alone would
 * only reach the browser's *next* request, and this one still needs a valid credential.
 */
function nextWithRotatedSession(req: NextRequest, rotated: RotatedSession): NextResponse {
  const jar = new Map(req.cookies.getAll().map((cookie) => [cookie.name, cookie.value]));
  jar.set(SESSION_TOKEN_COOKIE, rotated.accessToken);
  jar.set(SESSION_REFRESH_COOKIE, rotated.refreshToken);

  const headers = new Headers(req.headers);
  headers.set(
    'cookie',
    [...jar].map(([name, value]) => `${name}=${value}`).join('; '),
  );

  const response = NextResponse.next({ request: { headers } });
  response.cookies.set({ name: SESSION_TOKEN_COOKIE, value: rotated.accessToken, ...cookieOptions() });
  response.cookies.set({
    name: SESSION_REFRESH_COOKIE,
    value: rotated.refreshToken,
    ...cookieOptions(),
  });
  return response;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (matches(pathname, PUBLIC) || !matches(pathname, PROTECTED)) return NextResponse.next();

  const sessionId = req.cookies.get(SESSION_ID_COOKIE)?.value;
  const accessToken = req.cookies.get(SESSION_TOKEN_COOKIE)?.value;

  if (!sessionId || !accessToken) return redirectAndClear(req);

  if (!isAccessTokenExpired(accessToken)) return NextResponse.next();

  const refreshToken = req.cookies.get(SESSION_REFRESH_COOKIE)?.value;
  if (!refreshToken) return redirectAndClear(req);

  // A rejected exchange (revoked session, rotated token, backend down) is indistinguishable here,
  // and all of them mean the same thing to the learner: sign in again.
  const rotated = await refreshSession(sessionId, refreshToken);
  if (rotated === null) return redirectAndClear(req);

  return nextWithRotatedSession(req, rotated);
}

export const config = {
  matcher: ['/', '/mastery/:path*', '/lessons/:path*', '/diagnostic/:path*', '/account/:path*'],
};
