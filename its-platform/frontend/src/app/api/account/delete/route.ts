import { NextResponse, type NextRequest } from 'next/server';

import { deleteAccount } from '@/infrastructure/account/account-bff.server';
import { clearSessionCookies } from '@/infrastructure/auth/bff-session.server';
import { routes } from '@/shared/routes';

/**
 * `POST /api/account/delete` — the learner closes their own account.
 *
 * **The confirmation happens on the screen, not here.** The screen asks the learner to
 * type `EXCLUIR` before it will post; this handler is the second half of that, and the
 * second half alone would delete the account on a single click — which is exactly the
 * "prevention of errors" that a destructive action needs and cannot have.
 *
 * **The session dies with the account.** The credential belonged to an account that no
 * longer exists, so the cookies are cleared before the redirect. A learner left with a
 * live session and a deleted account would meet a platform that can only answer `404`,
 * and would read that as a bug.
 */
export async function POST(req: NextRequest) {
  const response = await deleteAccount();

  if (response === null) {
    return NextResponse.json(
      { error: 'Não há sessão ativa para encerrar.' },
      { status: 401 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: 'A plataforma recusou a exclusão da sua conta.' },
      { status: response.status },
    );
  }

  const redirect = NextResponse.redirect(new URL(routes.login, req.url));
  clearSessionCookies(redirect);
  return redirect;
}
