'use server';

import { redirect } from 'next/navigation';
import { toDomainError, type ResetPasswordResult } from '@/core';
import { resetPassword } from '@/infrastructure/auth/password-reset.server';
import { routes } from '@/shared/routes';
import { serializeDomainError, type ActionResult, type SerializedDomainError } from '@/shared/action-result';

/**
 * The state the "reset password" form carries between submissions.
 */
export interface ResetPasswordState {
  readonly result: ActionResult<ResetPasswordResult> | null;
}

/**
 * Consumes the one-time token and sets the new password.
 *
 * The `redirect` sits **outside** the `try`: it works by throwing, and a `catch` around
 * it would turn a successful reset into the error screen. The user is sent to the login
 * page with `?reset=success`, where the confirmation is shown.
 */
export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get('token') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');

  let result: ActionResult<ResetPasswordResult>;
  try {
    const data = await resetPassword({ token, newPassword });
    result = { ok: true, data };
  } catch (error) {
    const serialized: SerializedDomainError = serializeDomainError(toDomainError(error));
    result = { ok: false, error: serialized };
  }

  if (result.ok) {
    redirect(routes.loginWithResetSuccess);
  }

  return { result };
}
