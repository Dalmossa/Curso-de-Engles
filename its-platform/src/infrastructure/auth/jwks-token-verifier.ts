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
  type TokenVerifier,
} from '../../common/auth/token-principal.js';
import { refusalFor, scopesOf } from './token-claims.js';

export interface JwksTokenVerifierOptions {
  readonly jwksUri: string;
  readonly issuer: string;
  readonly audience: string;
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
      const refusal = refusalFor(error);
      throw new TokenVerificationError(refusal.message, refusal.reason);
    }

    const subject = payload['sub'];
    if (typeof subject !== 'string' || subject.trim().length === 0) {
      throw new TokenVerificationError('the token carries no `sub`', 'missing_subject');
    }

    return { subject, scopes: scopesOf(payload), claims: { ...payload } };
  }
}
