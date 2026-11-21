import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, clearSessionCookies } from '@/infrastructure/auth/bff-session.server';
import { SESSION_TOKEN_COOKIE } from '@/shared/auth-cookies';
import { redirectTo } from '@/shared/request-origin';

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get(SESSION_TOKEN_COOKIE)?.value;

  // Revoking server-side is best effort: the browser's session is cleared regardless, and a
  // backend that is down must not leave the user unable to log out.
  if (accessToken !== undefined) {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        headers: { authorization: `Bearer ${accessToken}` },
      });
    } catch {
      // Intentionally ignored — see above.
    }
  }

  const response = NextResponse.redirect(redirectTo(req, '/login'));
  clearSessionCookies(response);
  return response;
}
