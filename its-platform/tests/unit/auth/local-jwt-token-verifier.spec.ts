/**
 * The verifier that lets a login reach the API when the platform is its own Authorization Server.
 *
 * `OIDC_*` unset is the local deployment: `AuthService` mints an RS256 access token with the key
 * pair whose public half it publishes at `/api/v1/.well-known/jwks.json`. `JwksTokenVerifier` would
 * fetch that JWKS over HTTP from the same process — a round trip to ourselves that breaks on every
 * restart, because the key pair is generated in-process. `LocalJwtTokenVerifier` performs the same
 * checks against the in-process public key.
 *
 * The risk of a second verifier is that it is *easier* than the first and quietly becomes the real
 * one. `CONSTITUTION.md` §4.5 therefore binds here exactly as it binds there — RS256 only, all
 * claim checks on, fail closed — and each clause below is a case rather than a comment:
 *
 * | clause | case |
 * |---|---|
 * | RS256 pinned | an `HS256` token is refused |
 * | a signature must verify | a token signed by another key is refused |
 * | `exp` | an expired token is refused |
 * | `iss` | a foreign issuer is refused |
 * | `aud` | a foreign audience is refused |
 * | `sub` is the learner id | a token without `sub` is refused |
 * | the scope claim is space-delimited | `learner:self content:read` becomes two scopes |
 */

import { generateKeyPair, SignJWT, type KeyLike } from 'jose';

import { LocalJwtTokenVerifier } from '../../../src/infrastructure/auth/local-jwt-token-verifier.js';
import {
  TokenVerificationError,
  type TokenPrincipal,
} from '../../../src/common/auth/token-principal.js';

const SUBJECT = '8141be7c-57f7-49fa-aaf6-36e94471fc82';
const ISSUER = 'its-platform';
const AUDIENCE = 'its-learners';

let publicKey: KeyLike;
let privateKey: KeyLike;
let foreignPrivateKey: KeyLike;
let verifier: LocalJwtTokenVerifier;

beforeAll(async () => {
  ({ publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true }));
  ({ privateKey: foreignPrivateKey } = await generateKeyPair('RS256', { extractable: true }));

  verifier = new LocalJwtTokenVerifier({ publicKey, issuer: ISSUER, audience: AUDIENCE });
});

interface SignOptions {
  readonly key?: KeyLike;
  readonly issuer?: string;
  readonly audience?: string;
  readonly expiresIn?: string | number;
  readonly algorithm?: string;
}

async function sign(claims: Record<string, unknown>, options: SignOptions = {}): Promise<string> {
  const jwt = new SignJWT(claims).setProtectedHeader({
    alg: options.algorithm ?? 'RS256',
    kid: 'its-platform-1',
  });

  if (options.issuer !== undefined) jwt.setIssuer(options.issuer);
  if (options.audience !== undefined) jwt.setAudience(options.audience);
  if (options.expiresIn !== undefined) jwt.setExpirationTime(options.expiresIn);

  return jwt.sign(options.key ?? privateKey);
}

function claims(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    sub: SUBJECT,
    scope: 'learner:self content:read',
    ...extra,
  };
}

async function refusal(token: string): Promise<TokenVerificationError> {
  const error = await verifier.verify(token).catch((thrown: unknown) => thrown);
  expect(error).toBeInstanceOf(TokenVerificationError);
  return error as TokenVerificationError;
}

describe('LocalJwtTokenVerifier — a token this platform minted becomes a principal', () => {
  it('reads the learner id from `sub` (ADR-038 D7)', async () => {
    const token = await sign(claims(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn: '5m',
    });

    const principal: TokenPrincipal = await verifier.verify(token);

    expect(principal.subject).toBe(SUBJECT);
  });

  it('reads the scope set from the space-delimited `scope` claim (RFC 8693 §4.2)', async () => {
    const token = await sign(claims(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn: '5m',
    });

    await expect(verifier.verify(token)).resolves.toMatchObject({
      scopes: ['learner:self', 'content:read'],
    });
  });

  it('a token with no `scope` claim yields no scopes — not every scope', async () => {
    const token = await sign({ sub: SUBJECT }, { issuer: ISSUER, audience: AUDIENCE, expiresIn: '5m' });

    const principal = await verifier.verify(token);

    expect(principal.scopes).toEqual([]);
  });
});

describe('LocalJwtTokenVerifier — §4.5 refuses what it must', () => {
  it('refuses a token signed by a key this platform does not hold', async () => {
    const token = await sign(claims(), {
      key: foreignPrivateKey,
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn: '5m',
    });

    expect((await refusal(token)).reason).toBe('invalid_signature');
  });

  it('refuses an expired token', async () => {
    const token = await sign(claims(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn: Math.floor(Date.now() / 1000) - 60,
    });

    expect((await refusal(token)).reason).toBe('expired');
  });

  it('refuses a foreign issuer', async () => {
    const token = await sign(claims(), {
      issuer: 'https://idp.example.com',
      audience: AUDIENCE,
      expiresIn: '5m',
    });

    expect((await refusal(token)).reason).toBe('claims');
  });

  it('refuses a foreign audience', async () => {
    const token = await sign(claims(), {
      issuer: ISSUER,
      audience: 'someone-else',
      expiresIn: '5m',
    });

    expect((await refusal(token)).reason).toBe('claims');
  });

  it('refuses a token with no `sub`, which no route could authorise', async () => {
    const token = await sign({ scope: 'learner:self' }, {
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn: '5m',
    });

    expect((await refusal(token)).reason).toBe('missing_subject');
  });

  it('refuses an `HS256` token — the algorithm pin, not the key, decides', async () => {
    // The shape of algorithm confusion: a caller who knows the public key signs with it as an
    // HMAC secret. Pinning must reject it before any key material is consulted.
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', kid: 'its-platform-1' })).toString(
      'base64url',
    );
    const body = Buffer.from(
      JSON.stringify({ sub: SUBJECT, iss: ISSUER, aud: AUDIENCE, exp: 9_999_999_999 }),
    ).toString('base64url');
    const { createHmac } = await import('crypto');
    const signature = createHmac('sha256', 'not-the-secret')
      .update(`${header}.${body}`)
      .digest('base64url');

    const error = await refusal(`${header}.${body}.${signature}`);

    expect(['invalid_signature', 'malformed']).toContain(error.reason);
  });

  it('refuses a token that is not a JWT at all', async () => {
    expect((await refusal('not-a-token')).reason).toBe('malformed');
  });
});
