/**
 * The only implementation of `TokenVerifier` a running system uses (A5b).
 *
 * Every clause of `CONSTITUTION.md` §4.5 that is about *validation* is an option to `jose.jwtVerify`
 * below, and the list is short on purpose:
 *
 * ```
 * algorithms: ['RS256']     the pin — §4.5 names the option, `verifyOptions.algorithms`
 * issuer, audience          iss / aud — "validated on every request"
 * (exp, nbf are always on)  jose checks these unless tolerance is added, and none is added
 * ```
 *
 * Nothing here mints, refreshes or re-signs a token. ADR-013's *Settled* half records the platform
 * as a Resource Server and is the reason this file has no counterpart that signs.
 *
 * **Fail closed.** Every refusal — a bad signature, a claim, `kid` not in the JWKS, and equally a
 * JWKS that cannot be fetched — becomes a `TokenVerificationError`, which the guard maps to 401.
 * No path in this file can raise a 5xx, and none can return a principal it did not verify. That is
 * the difference between *deny by default* and *deny when convenient*.
 *
 * The key set is remote because a JWKS is the only key material an OIDC provider publishes; A5b
 * does not choose that provider (ADR-013's half-open question), only how a token is checked. The
 * URI, the issuer and the audience are configuration, and `token-verifier-from-env.ts` is where
 * an unconfigured deployment is turned into a verifier that refuses everything.
 */

import { createRemoteJWKSet, jwtVerify } from 'jose';

import {
  TokenVerificationError,
  type TokenPrincipal,
  type TokenRefusal,
  type TokenVerifier,
} from '../../common/auth/token-principal.js';

export interface JwksTokenVerifierOptions {
  readonly jwksUri: string;
  readonly issuer: string;
  readonly audience: string;
}

/** The `scope` claim, as RFC 8693 §4.2 defines it for this exact case: space-delimited. */
function scopesOf(payload: Record<string, unknown>): string[] {
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
function reasonFor(error: unknown): { message: string; reason: TokenRefusal } {
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

export class JwksTokenVerifier implements TokenVerifier {
  private readonly remote: ReturnType<typeof createRemoteJWKSet>;

  constructor(private readonly options: JwksTokenVerifierOptions) {
    this.remote = createRemoteJWKSet(new URL(options.jwksUri));
  }

  async verify(token: string): Promise<TokenPrincipal> {
    let payload: Record<string, unknown>;
    try {
      ({ payload } = await jwtVerify(token, this.remote, {
        algorithms: ['RS256'],
        issuer: this.options.issuer,
        audience: this.options.audience,
      }));
    } catch (error) {
      const refusal = reasonFor(error);
      throw new TokenVerificationError(refusal.message, refusal.reason);
    }

    const subject = payload['sub'];
    if (typeof subject !== 'string' || subject.trim().length === 0) {
      throw new TokenVerificationError('the token carries no `sub`', 'missing_subject');
    }

    return { subject, scopes: scopesOf(payload), claims: { ...payload } };
  }
}
