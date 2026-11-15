import type { ForgotPasswordResult, PasswordResetRepository } from '@/core';
import { DomainError, isEmailCandidate } from '@/core';

/**
 * Use case: asks the platform for a password reset token.
 *
 * The e-mail is trimmed and checked here before it leaves the server — a Server Action is
 * an untrusted entry point (Next.js's own words), and a form can be posted by anything
 * that can reach the page. The platform is still the authority on whether the address
 * exists; this check only refuses an address that could never be accepted.
 */
export class RequestPasswordReset {
  constructor(private readonly passwordReset: PasswordResetRepository) {}

  async execute(email: string): Promise<ForgotPasswordResult> {
    const normalized = email.trim();
    if (!isEmailCandidate(normalized)) {
      throw new DomainError({
        kind: 'invalid_input',
        status: 400,
        title: 'E-mail inválido',
        detail: 'Informe um e-mail válido para solicitar a redefinição de senha.',
        problemType: null,
        requestId: null,
        retryAfterSeconds: null,
      });
    }

    return this.passwordReset.requestReset(normalized);
  }
}
