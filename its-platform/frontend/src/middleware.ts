import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/', '/mastery', '/practice', '/lessons'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (!isProtected) return NextResponse.next();

  const sessionId = req.cookies.get('its_session_id');
  const sessionToken = req.cookies.get('its_session');
  const hasSession = sessionId && sessionToken;

  if (hasSession) return NextResponse.next();

  // Allow in dev if ITS_API_TOKEN is used server-side; still redirect to login for better UX
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/', '/mastery/:path*', '/practice/:path*', '/lessons/:path*'],
};
