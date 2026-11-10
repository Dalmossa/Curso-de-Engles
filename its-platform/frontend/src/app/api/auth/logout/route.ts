import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/api/v1/auth/logout`, {
    method: 'POST',
    headers: { cookie: req.headers.get('cookie') || '' },
    cache: 'no-store',
  });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  const resp = NextResponse.redirect(new URL('/login', req.url));
  for (const c of setCookies) {
    resp.headers.append('set-cookie', c);
  }
  return resp;
}
