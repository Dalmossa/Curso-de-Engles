/**
 * Configuration → `TokenVerifier` (A5b).
 *
 * The composition root reads three variables, and there is no fourth that can weaken the result:
 * no `ALGORITHM` (the pin is in code, §4.5), no "skip verification" flag, and no default key. An
 * incomplete configuration is a **verifier that refuses everything** — the same class of decision
 * `DenyAllTokenVerifier` documents, and it is why this factory cannot return `undefined`: a caller
 * that had to handle "no verifier" would eventually handle it by letting the request through.
 *
 * The names are exported because a second place now needs them (`tests/helpers/tokens.ts` sets the
 * environment and must not spell them differently) — an imported constant is the only arrangement
 * in which that drift is impossible rather than merely unlikely.
 */

import type { TokenVerifier } from '../../common/auth/token-principal.js';
import { DenyAllTokenVerifier } from './deny-all-token-verifier.js';
import { JwksTokenVerifier } from './jwks-token-verifier.js';

export const OIDC_ENV = {
  jwksUri: 'OIDC_JWKS_URI',
  issuer: 'OIDC_ISSUER',
  audience: 'OIDC_AUDIENCE',
} as const;

export function tokenVerifierFromEnv(env: NodeJS.ProcessEnv = process.env): TokenVerifier {
  const missing: string[] = [];
  const read = (name: string): string => {
    const value = env[name];
    if (value === undefined || value.trim().length === 0) {
      missing.push(name);
      return '';
    }
    return value;
  };

  const jwksUri = read(OIDC_ENV.jwksUri);
  const issuer = read(OIDC_ENV.issuer);
  const audience = read(OIDC_ENV.audience);

  if (missing.length > 0) {
    // Spelled out in the message: the only symptom is a 401 on every route, and the log line is
    // where an operator learns *which* variable is why.
    return new DenyAllTokenVerifier(
      `token verification is not configured (${missing.join(', ')} absent)`,
    );
  }

  return new JwksTokenVerifier({ jwksUri, issuer, audience });
}
