import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_ID_COOKIE, SESSION_TOKEN_COOKIE } from '@/shared/auth-cookies';

/**
 * Next.js 16 calls this file `proxy` (it was `middleware`). It runs before a protected route is
 * rendered and performs the *optimistic* check: are both session cookies present? It deliberately
 * does not verify the token — the server container presents it to the API, which is the only party
 * that can decide, and a proxy that duplicated verification would be a second answer to a security
 * question.
 *
 * `/login` and `/register` are never redirected away from, even with a session: a token that the
 * API no longer accepts (a backend restart rotates its key pair) must not leave the learner unable
 * to reach the form that replaces it.
 */
const PROTECTED = ['/', '/mastery', '/practice', '/lessons'];

function hasSession(req: NextRequest): boolean {
  return Boolean(req.cookies.get(SESSION_ID_COOKIE) && req.cookies.get(SESSION_TOKEN_COOKIE));
}

export function proxy(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED.some((path) => pathname === path || pathname.startsWith(path + '/'));

  if (!isProtected || hasSession(req)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/', '/mastery/:path*', '/practice/:path*', '/lessons/:path*'],
};
