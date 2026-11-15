import type { ForgotPasswordResult, ResetPasswordInput, ResetPasswordResult } from '../entities/password-reset';

/**
 * Port for the password recovery operations.
 *
 * Both operations are **public** on the API: the person asking for a new password is by
 * definition not signed in, so a credential is not available — and sending one would mean
 * asking the API on behalf of somebody else. The adapter that satisfies this port is
 * therefore the one that talks to the API without a bearer token.
 */
export interface PasswordResetRepository {
  /** Asks for a one-time reset token for `email`. */
  requestReset(email: string): Promise<ForgotPasswordResult>;

  /** Consumes the token and sets a new password. */
  resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResult>;
}
