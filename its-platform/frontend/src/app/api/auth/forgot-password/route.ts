import { NextResponse, type NextRequest } from 'next/server';
import { requestPasswordReset, toProblemBody } from '@/infrastructure/auth/password-reset.server';

/**
 * BFF route handler for `POST /api/auth/forgot-password`.
 *
 * The browser never talks to the NestJS API directly: this handler is the one that
 * knows the base URL and the error vocabulary. The body is JSON in and JSON out, and a
 * refusal comes back as an RFC 9457 problem — the same shape the API would have sent.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let email = '';
  try {
    const payload = (await req.json()) as { email?: unknown };
    email = typeof payload.email === 'string' ? payload.email : '';
  } catch {
    const { status, body } = toProblemBody(
      new Error('O corpo da requisição não é um JSON válido.'),
    );
    return NextResponse.json(body, { status });
  }

  try {
    const result = await requestPasswordReset(email);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const { status, body } = toProblemBody(error);
    return NextResponse.json(body, { status });
  }
}
