import 'server-only';

import { toDomainError, type ForgotPasswordResult, type ResetPasswordInput, type ResetPasswordResult } from '@/core';
import { getPasswordResetUseCases } from '@/infrastructure/composition/server-container';

/**
 * The password recovery, as the server sees it.
 *
 * Both operations are public on the API, and both are reached through the **public**
 * transport — no bearer token is attached, because the person who forgot the password is
 * not signed in.
 *
 * The failures leave this module as `DomainError`, because that is the vocabulary every
 * other layer of the frontend speaks: the Server Action serialises it, and the BFF
 * route handler turns it into an RFC 9457 body.
 */

export async function requestPasswordReset(email: string): Promise<ForgotPasswordResult> {
  const { requestPasswordReset: useCase } = getPasswordResetUseCases();
  return useCase.execute(email);
}

export async function resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResult> {
  const { resetPassword: useCase } = getPasswordResetUseCases();
  return useCase.execute(input);
}

/** The RFC 9457 body the BFF answers with when the platform refuses the request. */
export interface ProblemBody {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail?: string;
}

/**
 * Turns a failure into the problem body the API would have sent.
 *
 * The BFF speaks the API's own error vocabulary, so a client sees the same shape whether
 * the refusal came from the NestJS application or from this proxy. A `5xx` carries no
 * `detail` — the internal message belongs in the log, not in a body that reaches the
 * browser.
 */
export function toProblemBody(error: unknown): { status: number; body: ProblemBody } {
  const domainError = toDomainError(error);
  const status = domainError.status ?? 500;
  const title = domainError.title === '' ? 'Erro inesperado' : domainError.title;

  return {
    status,
    body: {
      type: 'about:blank',
      title,
      status,
      ...(status >= 500 || domainError.detail === '' ? {} : { detail: domainError.detail }),
    },
  };
}
