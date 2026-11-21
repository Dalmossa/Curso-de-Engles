import { NextRequest, NextResponse } from 'next/server';
import {
  apiFetch,
  applySessionCookies,
  isAuthSessionPayload,
} from '@/infrastructure/auth/bff-session.server';
import { safeRedirectPath } from '@/shared/safe-redirect';
import { redirectTo } from '@/shared/request-origin';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const next = safeRedirectPath(form.get('next'));

  let response: Response;
  try {
    response = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password'),
      }),
    });
  } catch {
    return NextResponse.redirect(redirectTo(req, '/login?error=unavailable'));
  }

  const payload = await response.json().catch(() => null);

  // A successful status with no session body is not a login: without the identifiers there is
  // nothing to put in the cookies, and redirecting to `/` would send the learner straight back
  // here through the proxy — the loop this handler exists to close.
  if (!response.ok || !isAuthSessionPayload(payload)) {
    const target = redirectTo(req, '/login');
    target.searchParams.set('error', response.status === 401 ? 'invalid' : 'unavailable');
    target.searchParams.set('next', next);
    return NextResponse.redirect(target);
  }

  const redirect = NextResponse.redirect(redirectTo(req, next));
  applySessionCookies(redirect, payload);
  return redirect;
}
