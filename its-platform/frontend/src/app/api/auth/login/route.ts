import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const form = await req.formData();
  const body = {
    email: form.get('email'),
    password: form.get('password'),
  };
  const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.redirect(new URL('/login?error=invalid', req.url));
  }
  // proxy cookies
  const setCookies = res.headers.getSetCookie?.() ?? [];
  const resp = NextResponse.redirect(new URL('/', req.url));
  for (const c of setCookies) {
    resp.headers.append('set-cookie', c);
  }
  return resp;
}
