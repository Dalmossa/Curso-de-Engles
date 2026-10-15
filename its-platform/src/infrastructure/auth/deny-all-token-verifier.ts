/**
 * What a deployment gets when no one told it how to verify a token (A5b).
 *
 * The alternative to a verifier is not "no verification" — it is a default. `CONSTITUTION.md` §4.5
 * names the default: *deny* by default. So a process whose `OIDC_JWKS_URI` (or issuer, or
 * audience) is unset does not skip the guard and does not answer 500: it answers **401 to
 * everything**, and says which variable was missing in the only place a refusal can be diagnosed
 * — the log, via `TokenVerificationError.reason`.
 *
 * This is not a hypothetical branch. `OIDC_*` is not in anybody's `.env` today, and A5b ships the
 * guard before the provider (ADR-013's open half). Without this class, the honest result of that
 * ordering would be a verifier that allowed everything, i.e. exactly the state A0 measured.
 */

import {
  TokenVerificationError,
  type TokenPrincipal,
  type TokenVerifier,
} from '../../common/auth/token-principal.js';

export class DenyAllTokenVerifier implements TokenVerifier {
  constructor(private readonly because: string) {}

  async verify(): Promise<TokenPrincipal> {
    throw new TokenVerificationError(this.because, 'unconfigured');
  }
}
