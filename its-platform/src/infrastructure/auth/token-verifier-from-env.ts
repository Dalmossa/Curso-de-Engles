/**
 * Configuration → `TokenVerifier` (A5b).
 *
 * The composition root reads three variables for external OIDC, or falls back to the platform's
 * own JWKS endpoint when the platform is the Authorization Server (ADR-013 Q1 = Yes).
 * An incomplete configuration is a **verifier that refuses everything** — the same class of decision
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

  // First try external OIDC configuration
  const jwksUriFromEnv = read(OIDC_ENV.jwksUri);
  const issuerFromEnv = read(OIDC_ENV.issuer);
  const audienceFromEnv = read(OIDC_ENV.audience);

  if (missing.length > 0) {
    // Any missing OIDC configuration → deny all with missing variable reason
    const reason = `missing OIDC configuration: ${missing.join(', ')}`;
    return new DenyAllTokenVerifier(reason);
  }

  // External OIDC provider fully configured
  const jwksUri = env[OIDC_ENV.jwksUri]!;
  const issuer = env[OIDC_ENV.issuer]!;
  const audience = env[OIDC_ENV.audience]!;

  return new JwksTokenVerifier({ jwksUri, issuer, audience });
}
