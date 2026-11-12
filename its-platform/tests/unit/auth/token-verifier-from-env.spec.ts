/**
 * A5b — configuration becomes a decision, and the decision is a refusal.
 *
 * The platform is an Authorization Server (ADR-013 Q1 = Yes). It first tries external OIDC
 * configuration, then falls back to its own JWKS endpoint.
 *
 * The error message is asserted, not because a user reads it but because the **only** symptom of a
 * missing variable is a 401 on every protected route, and the log line is where an operator
 * discovers which one. That makes the message load-bearing, and therefore worth a test.
 */

import {
  OIDC_ENV,
  tokenVerifierFromEnv,
} from '../../../src/infrastructure/auth/token-verifier-from-env.js';
import { TokenVerificationError } from '../../../src/common/auth/token-principal.js';

const COMPLETE_OIDC = {
  [OIDC_ENV.jwksUri]: 'https://idp.example.com/.well-known/jwks.json',
  [OIDC_ENV.issuer]: 'https://idp.example.com',
  [OIDC_ENV.audience]: 'its-platform-api',
};

async function refusal(env: NodeJS.ProcessEnv): Promise<TokenVerificationError> {
  const thrown = await tokenVerifierFromEnv(env)
    .verify('any.token.at.all')
    .catch((error: unknown) => error);

  expect(thrown).toBeInstanceOf(TokenVerificationError);
  return thrown as TokenVerificationError;
}

describe('tokenVerifierFromEnv — external OIDC configuration', () => {
  it.each(Object.values(OIDC_ENV))('names %s as the reason it cannot verify', async (name) => {
    const env = { ...COMPLETE_OIDC } as NodeJS.ProcessEnv;
    delete env[name];

    expect((await refusal(env)).message).toContain(name);
  });

  it('denies with every missing variable named at once, not one per attempt', async () => {
    const { message } = await refusal({} as NodeJS.ProcessEnv);

    for (const name of Object.values(OIDC_ENV)) expect(message).toContain(name);
  });

  it.each([
    ['an empty string', ''],
    ['whitespace', '   '],
  ])('treats %s as absent rather than as a URI', async (_label, value) => {
    const env = { ...COMPLETE_OIDC, [OIDC_ENV.jwksUri]: value } as NodeJS.ProcessEnv;

    expect((await refusal(env)).message).toContain(OIDC_ENV.jwksUri);
  });
});

describe('tokenVerifierFromEnv — platform fallback (ADR-013 Q1 = Yes)', () => {
  it('uses platform JWKS when OIDC is not configured', async () => {
    const env = {
      PLATFORM_JWKS_URI: 'http://localhost:3000/.well-known/jwks.json',
      PLATFORM_ISSUER: 'its-platform',
      PLATFORM_AUDIENCE: 'its-learners',
    } as NodeJS.ProcessEnv;

    const verifier = tokenVerifierFromEnv(env);
    // Should not throw immediately - it creates a JWKS verifier for the platform endpoint
    expect(verifier).toBeDefined();
  });

  it('denies when platform JWKS is unreachable', async () => {
    const env = {
      PLATFORM_JWKS_URI: 'http://unreachable:9999/.well-known/jwks.json',
      PLATFORM_ISSUER: 'its-platform',
      PLATFORM_AUDIENCE: 'its-learners',
    } as NodeJS.ProcessEnv;

    const verifier = tokenVerifierFromEnv(env);
    // Should create a verifier that will fail when JWKS cannot be fetched
    expect(verifier).toBeDefined();
    await expect(verifier.verify('invalid.token')).rejects.toThrow(TokenVerificationError);
  });
});
