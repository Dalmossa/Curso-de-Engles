/**
 * Claim handling shared by every `TokenVerifier`.
 *
 * `scopesOf` and `refusalFor` were private to `JwksTokenVerifier`; the platform now also verifies
 * the tokens its own `AuthService` mints (ADR-013 Q1 resolved to "the platform is also an
 * Authorization Server" for local development), and a second copy of either function would be a
 * second answer to "what counts as a scope" and "what does this `jose` error mean".
 */

import type { TokenRefusal } from '../../common/auth/token-principal.js';

/** The `scope` claim, as RFC 8693 §4.2 defines it for this exact case: space-delimited. */
export function scopesOf(payload: Record<string, unknown>): string[] {
  const raw = payload['scope'];
  if (typeof raw !== 'string') return [];
  return raw.split(/\s+/).filter((scope) => scope.length > 0);
}

function isCode(value: unknown, code: string): boolean {
  return typeof value === 'object' && value !== null && (value as { code?: unknown }).code === code;
}

/**
 * Turns a library error into one of our reasons. `jose` tags every error with a stable `code`
 * string, so this maps without depending on the classes — an approach that keeps working when the
 * library renames an export, which is the usual fate of a check like this.
 */
export function refusalFor(error: unknown): { message: string; reason: TokenRefusal } {
  if (typeof (error as { code?: unknown })?.code === 'string') {
    if (isCode(error, 'ERR_JWT_EXPIRED')) {
      return { message: 'the token has expired', reason: 'expired' };
    }
    if (isCode(error, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED')) {
      return { message: 'the token signature does not verify', reason: 'invalid_signature' };
    }
    if (isCode(error, 'ERR_JWT_CLAIM_VALIDATION_FAILED')) {
      return { message: 'the token claims are not valid here', reason: 'claims' };
    }
  }
  return { message: 'the token is not usable', reason: 'malformed' };
}
