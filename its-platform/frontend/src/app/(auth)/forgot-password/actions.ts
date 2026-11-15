'use server';

import { toDomainError, type ForgotPasswordResult } from '@/core';
import { requestPasswordReset } from '@/infrastructure/auth/password-reset.server';
import { serializeDomainError, type ActionResult, type SerializedDomainError } from '@/shared/action-result';

/**
 * The state the "forgot password" form carries between submissions.
 *
 * `result` is the project's own `ActionResult`: a success carries the data, a failure
 * carries the serialised `DomainError`. The failure is **returned**, never thrown — a
 * Server Action that throws reaches the browser as a redacted error with no message, and
 * the message is the whole point of this screen.
 */
export interface ForgotPasswordState {
  readonly result: ActionResult<ForgotPasswordResult> | null;
}

export async function forgotPasswordAction(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get('email') ?? '');

  try {
    const data = await requestPasswordReset(email);
    return { result: { ok: true, data } };
  } catch (error) {
    const serialized: SerializedDomainError = serializeDomainError(toDomainError(error));
    return { result: { ok: false, error: serialized } };
  }
}
