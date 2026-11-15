import type { PasswordResetRepository, ResetPasswordInput, ResetPasswordResult } from '@/core';
import { DomainError, validatePasswordLength } from '@/core';

/**
 * Use case: consumes a one-time token and sets a new password.
 *
 * The token is required and the new password is checked against the policy **before** the
 * request leaves the server. The confirmation field never leaves the browser: it exists
 * to catch a typing mistake, and it has no meaning for the platform.
 */
export class ResetPassword {
  constructor(private readonly passwordReset: PasswordResetRepository) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordResult> {
    const token = input.token.trim();
    if (token === '') {
      throw new DomainError({
        kind: 'invalid_input',
        status: 400,
        title: 'Token ausente',
        detail: 'O link de redefinição não traz um token válido. Solicite um novo link.',
        problemType: null,
        requestId: null,
        retryAfterSeconds: null,
      });
    }

    const validation = validatePasswordLength(input.newPassword);
    if (!validation.ok) {
      throw new DomainError({
        kind: 'invalid_input',
        status: 400,
        title: 'Senha inválida',
        detail: 'A senha nova não atende à política de senhas.',
        problemType: null,
        requestId: null,
        retryAfterSeconds: null,
      });
    }

    return this.passwordReset.resetPassword({ token, newPassword: input.newPassword });
  }
}
