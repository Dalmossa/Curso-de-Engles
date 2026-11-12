import { NextRequest, NextResponse } from 'next/server';
import {
  apiFetch,
  applySessionCookies,
  isAuthSessionPayload,
} from '@/infrastructure/auth/bff-session.server';
import { safeRedirectPath } from '@/shared/safe-redirect';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const next = safeRedirectPath(form.get('next'));

  let response: Response;
  try {
    response = await apiFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: form.get('displayName') || undefined,
        email: form.get('email'),
        password: form.get('password'),
      }),
    });
  } catch {
    return NextResponse.redirect(new URL('/register?error=unavailable', req.url));
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || !isAuthSessionPayload(payload)) {
    const target = new URL('/register', req.url);
    target.searchParams.set('error', response.status === 409 ? 'exists' : 'unavailable');
    return NextResponse.redirect(target);
  }

  const redirect = NextResponse.redirect(new URL(next, req.url));
  applySessionCookies(redirect, payload);
  return redirect;
}
