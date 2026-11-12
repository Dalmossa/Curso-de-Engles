/**
 * Verification for tokens minted by this platform's own `AuthService`.
 *
 * `JwksTokenVerifier` covers the Resource-Server deployment (an external IdP publishes a JWKS).
 * When no OIDC provider is configured, the platform runs as its own Authorization Server: the
 * `AuthService` holds an RSA key pair whose public half it already publishes at
 * `/api/v1/.well-known/jwks.json`. Fetching that endpoint over HTTP from the same process is a
 * network round-trip to ourselves, and it breaks on every restart because the key pair is
 * generated in-process. Verifying against the in-process public key is the same check — signature,
 * algorithm pin, `iss`, `aud`, `exp`, `nbf` — without the round-trip.
 *
 * The rules are deliberately identical to `JwksTokenVerifier`'s: RS256 only, fail closed, and the
 * `sub` is mandatory. A verifier that is easier in development than in production is how the
 * development path becomes the production path.
 */

import { jwtVerify, type KeyLike } from 'jose';

import {
  TokenVerificationError,
  type TokenPrincipal,
  type TokenVerifier,
} from '../../common/auth/token-principal.js';
import { refusalFor, scopesOf } from './token-claims.js';

export interface LocalJwtTokenVerifierOptions {
  readonly publicKey: KeyLike;
  readonly issuer: string;
  readonly audience: string;
}

export class LocalJwtTokenVerifier implements TokenVerifier {
  constructor(private readonly options: LocalJwtTokenVerifierOptions) {}

  async verify(token: string): Promise<TokenPrincipal> {
    let payload: Record<string, unknown>;
    try {
      ({ payload } = await jwtVerify(token, this.options.publicKey, {
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
