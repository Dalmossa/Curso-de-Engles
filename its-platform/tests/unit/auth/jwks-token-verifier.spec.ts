/**
 * A5b — the verifier that makes §4.5's five token requirements true.
 *
 * `CONSTITUTION.md` §4.5 is unusually specific, and every clause here is one of its sentences:
 * *"RS256, `verifyOptions.algorithms` pinned to `['RS256']`, and `iss` / `aud` / `exp` / `nbf`
 * validated on every request"* (ADR-013's *Settled* half carries the same list, and it is binding).
 * A pin that is not exercised is a comment: the algorithm-confusion case below signs with `HS256`
 * using a secret a caller could plausibly guess, which is the shape the pin exists to refuse.
 *
 * This suite talks to `tests/helpers/tokens.ts`, which generates a key pair, publishes the public
 * half as a real JWKS over loopback HTTP, and signs with the private half. So the verifier here
 * fetches keys and checks a signature for real; only the key's owner is different from production.
 *
 * | clause | case |
 * |---|---|
 * | RS256 pinned | an `HS256` token is refused |
 * | a signature must verify | a token signed by another key is refused |
 * | `exp` | an expired token is refused |
 * | `nbf` | a token that is not yet valid is refused |
 * | `iss` | a foreign issuer is refused |
 * | `aud` | a foreign audience is refused |
 * | the platform never mints tokens (ADR-013) | a token the fixture did not sign is refused — there is no local signing path |
 * | fail closed | an unreachable JWKS refuses, it does not raise a 5xx |
 */

import { startTokenFixture, foreignKey, type TokenFixture } from '../../helpers/tokens.js';
import { JwksTokenVerifier } from '../../../src/infrastructure/auth/jwks-token-verifier.js';
import {
  TokenVerificationError,
  type TokenPrincipal,
} from '../../../src/common/auth/token-principal.js';

const SUBJECT = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';

let fixture: TokenFixture;
let verifier: JwksTokenVerifier;

beforeAll(async () => {
  fixture = await startTokenFixture();
  verifier = new JwksTokenVerifier({
    jwksUri: fixture.jwksUri,
    issuer: fixture.issuer,
    audience: fixture.audience,
  });
});

afterAll(async () => {
  await fixture.close();
});

async function refusal(token: string): Promise<TokenVerificationError> {
  const error = await verifier.verify(token).catch((thrown: unknown) => thrown);
  expect(error).toBeInstanceOf(TokenVerificationError);
  return error as TokenVerificationError;
}

describe('JwksTokenVerifier — a valid token becomes a principal', () => {
  it('reads the learner id from `sub` (ADR-038 D7)', async () => {
    const principal: TokenPrincipal = await verifier.verify(await fixture.accessToken(SUBJECT));

    expect(principal.subject).toBe(SUBJECT);
  });

  it('reads the scope set from the `scope` claim, which is space-delimited (RFC 8693 §4.2)', async () => {
    const token = await fixture.accessToken(SUBJECT, ['learner:self', 'content:read']);

    await expect(verifier.verify(token)).resolves.toMatchObject({
      scopes: ['learner:self', 'content:read'],
    });
  });

  it('a token with no `scope` claim yields no scopes — not every scope', async () => {
    const principal = await verifier.verify(await fixture.accessToken(SUBJECT));

    expect(principal.scopes).toEqual([]);
  });
});

describe('JwksTokenVerifier — §4.5 refuses what it must', () => {
  it('refuses a token signed by a key the JWKS does not publish', async () => {
    const token = await fixture.sign({ sub: SUBJECT }, { key: await foreignKey() });

    await refusal(token);
  });

  it('refuses an expired token', async () => {
    const token = await fixture.sign({ sub: SUBJECT }, { expiresIn: -60 });

    await refusal(token);
  });

  it('refuses a token that is not yet valid', async () => {
    const token = await fixture.sign({ sub: SUBJECT }, { notBefore: 300 });

    await refusal(token);
  });

  it('refuses a token from another issuer', async () => {
    const token = await fixture.sign({ sub: SUBJECT }, { issuer: 'https://elsewhere.example' });

    await refusal(token);
  });

  it('refuses a token minted for another audience', async () => {
    const token = await fixture.sign({ sub: SUBJECT }, { audience: 'another-service' });

    await refusal(token);
  });

  it('refuses `HS256` — the algorithm is pinned to RS256', async () => {
    const token = await fixture.sign({ sub: SUBJECT }, { algorithm: 'HS256' });

    await refusal(token);
  });

  it('refuses a token with no signature', async () => {
    const token = await fixture.sign({ sub: SUBJECT }, { unsigned: true });

    await refusal(token);
  });

  it('refuses a token that is not a token at all', async () => {
    await refusal('mock_access_token');
  });

  it('refuses a token with no `sub` — an unidentified caller is not a learner', async () => {
    const token = await fixture.sign({ scope: 'learner:self' });

    await refusal(token);
  });
});

describe('JwksTokenVerifier — fails closed', () => {
  it('refuses when the JWKS cannot be reached, rather than raising a 5xx', async () => {
    const unreachable = new JwksTokenVerifier({
      jwksUri: 'http://127.0.0.1:1/.well-known/jwks.json',
      issuer: fixture.issuer,
      audience: fixture.audience,
    });

    await expect(
      unreachable.verify(await fixture.accessToken(SUBJECT)),
    ).rejects.toBeInstanceOf(TokenVerificationError);
  });
});
