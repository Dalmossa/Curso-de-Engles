import { NextResponse, type NextRequest } from 'next/server';
import { resetPassword, toProblemBody } from '@/infrastructure/auth/password-reset.server';

/**
 * BFF route handler for `POST /api/auth/reset-password`.
 *
 * The token and the new password go to the platform and never come back: the answer is
 * a confirmation message, or an RFC 9457 problem.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let token = '';
  let newPassword = '';
  try {
    const payload = (await req.json()) as { token?: unknown; newPassword?: unknown };
    token = typeof payload.token === 'string' ? payload.token : '';
    newPassword = typeof payload.newPassword === 'string' ? payload.newPassword : '';
  } catch {
    const { status, body } = toProblemBody(
      new Error('O corpo da requisição não é um JSON válido.'),
    );
    return NextResponse.json(body, { status });
  }

  try {
    const result = await resetPassword({ token, newPassword });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const { status, body } = toProblemBody(error);
    return NextResponse.json(body, { status });
  }
}
