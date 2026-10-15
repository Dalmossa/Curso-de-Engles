/**
 * A5b — configuration becomes a decision, and the decision is a refusal.
 *
 * The interesting property of this file is not that it reads three variables. It is that it
 * **cannot** return nothing, and therefore cannot return permission: a caller that had to handle
 * "no verifier configured" would eventually handle it by letting the request through, so the
 * factory answers with a verifier that refuses everything instead. `CONSTITUTION.md` §4.5 makes
 * that the required direction — *deny by default* — and the composition root relies on it.
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

const COMPLETE = {
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

describe('tokenVerifierFromEnv — an incomplete configuration denies', () => {
  it.each(Object.values(OIDC_ENV))('names %s as the reason it cannot verify', async (name) => {
    const env = { ...COMPLETE } as NodeJS.ProcessEnv;
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
    const env = { ...COMPLETE, [OIDC_ENV.jwksUri]: value } as NodeJS.ProcessEnv;

    expect((await refusal(env)).message).toContain(OIDC_ENV.jwksUri);
  });
});
