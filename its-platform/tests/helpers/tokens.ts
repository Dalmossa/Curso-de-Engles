/**
 * A local JWKS-signing fixture — ADR-013's *"local JWKS-signing fixture for P1 integration
 * tests (test-only; not a product IdP)"*, built in A5b.
 *
 * `CONSTITUTION.md` §4.5 makes three things binding on every request: a JWT is validated, the
 * algorithm is **pinned** (`verifyOptions.algorithms` = `['RS256']`), and `iss` / `aud` / `exp` /
 * `nbf` are checked. A test of that cannot use a mock verifier and still be evidence: a mock
 * verifier asserts that the guard calls *something*. This fixture therefore signs real RS256
 * tokens with a key it generates, publishes the matching public key as a real JWKS over real HTTP
 * on a loopback port, and hands the URI to the application — so the application fetches a JWKS and
 * verifies a signature exactly as it does in production, and only the *key's owner* differs.
 *
 * The private key is never written to disk and never committed: it is generated per fixture.
 *
 * Two entry points, deliberately different:
 *
 *   * `accessToken(subject, scopes)` — the shape a real caller presents. `sub` is the learner id
 *     (ADR-038 D7) and `scope` is the space-delimited claim RFC 8693 §4.2 uses.
 *   * `sign(claims, options)` — arbitrary claims, for the negative cases. A fixture that can only
 *     mint *valid* tokens cannot show that an invalid one is refused, and "the guard rejects a
 *     token with no signature" is the assertion that a default-allow guard fails.
 */

import { createServer, type Server } from 'http';
import type { AddressInfo } from 'net';

import { SignJWT, exportJWK, generateKeyPair, type JWK, type KeyLike } from 'jose';

// The *source* exports the names; this file must not spell them a second time. A test that set
// `IDP_JWKS_URL` while the composition root read `OIDC_JWKS_URI` would fail with a 401 and a
// message about configuration, and the duplication would be the reason.
export { OIDC_ENV } from '../../src/infrastructure/auth/token-verifier-from-env.js';
import { OIDC_ENV } from '../../src/infrastructure/auth/token-verifier-from-env.js';

export interface SignOptions {
  /** `exp` — seconds from now, or a `jose`-style duration string. Omit for the 5-minute default. */
  expiresIn?: number | string;
  /** Overrides the fixture's own issuer — the `iss` mismatch case. */
  issuer?: string;
  /** Overrides the fixture's own audience — the `aud` mismatch case. */
  audience?: string;
  /** `nbf` — seconds from now. A positive value is a token from the future. */
  notBefore?: number;
  /** Replaces the protected header — the algorithm-confusion cases. */
  algorithm?: 'RS256' | 'HS256' | 'none';
  /** Signs with this key instead of the fixture's — the wrong-key case. */
  key?: KeyLike;
  /** Omit the signature entirely (three-segment token, empty third segment). */
  unsigned?: boolean;
}

export interface TokenFixture {
  /** The URL the application must be told to fetch keys from. */
  readonly jwksUri: string;
  readonly issuer: string;
  readonly audience: string;
  /** The `kid` the fixture publishes and signs with. */
  readonly keyId: string;
  /** A well-formed token for `subject`, carrying `scopes` in the `scope` claim. */
  accessToken(subject: string, scopes?: string[]): Promise<string>;
  /** Arbitrary claims, for tokens that must be refused. */
  sign(claims: Record<string, unknown>, options?: SignOptions): Promise<string>;
  close(): Promise<void>;
}

export async function startTokenFixture(): Promise<TokenFixture> {
  const keyId = 'its-test-key-1';
  const { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true });
  const publicJwk: JWK = { ...(await exportJWK(publicKey)), kid: keyId, alg: 'RS256', use: 'sig' };

  const issuer = 'https://idp.test.its.example.com';
  const audience = 'its-platform-api';

  // A real HTTP endpoint, because the application fetches the JWKS over HTTP: `createRemoteJWKSet`
  // is the production path, and a fixture that handed the key over in-process would leave that path
  // unexercised. The mismatch case is the point — `iss`/`aud` are the fixture's here.
  const server: Server = createServer((request, response) => {
    if (request.url === '/.well-known/jwks.json') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ keys: [publicJwk] }));
      return;
    }
    response.writeHead(404, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ error: 'not_found' }));
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  const signWith = async (
    claims: Record<string, unknown>,
    options: SignOptions,
  ): Promise<string> => {
    const algorithm = options.algorithm ?? 'RS256';
    const jwt = new SignJWT(claims).setProtectedHeader({ alg: algorithm, kid: keyId });

    if (options.issuer !== undefined) jwt.setIssuer(options.issuer);
    if (options.audience !== undefined) jwt.setAudience(options.audience);
    if (options.expiresIn !== undefined) jwt.setExpirationTime(options.expiresIn);
    if (options.notBefore !== undefined) jwt.setNotBefore(Math.floor(Date.now() / 1000) + options.notBefore);

    if (options.unsigned === true) {
      const header = Buffer.from(JSON.stringify({ alg: algorithm, kid: keyId })).toString('base64url');
      const body = Buffer.from(JSON.stringify(claims)).toString('base64url');
      return `${header}.${body}.`;
    }
    if (algorithm === 'HS256') {
      // Algorithm confusion: a caller who knows the public key signs with it as an HMAC secret.
      // The public JWK is not the secret, so this is the *shape* of the attack — pinned algorithms
      // must refuse it before any key material is consulted.
      const { createHmac } = await import('crypto');
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', kid: keyId })).toString('base64url');
      const body = Buffer.from(JSON.stringify(claims)).toString('base64url');
      const hmac = createHmac('sha256', 'not-the-secret')
        .update(`${header}.${body}`)
        .digest('base64url');
      return `${header}.${body}.${hmac}`;
    }
    return jwt.sign(options.key ?? privateKey);
  };

  return {
    jwksUri: `http://127.0.0.1:${port}/.well-known/jwks.json`,
    issuer,
    audience,
    keyId,
    async accessToken(subject: string, scopes: string[] = []): Promise<string> {
      const claims: Record<string, unknown> = { sub: subject };
      if (scopes.length > 0) claims['scope'] = scopes.join(' ');
      return signWith(claims, { issuer, audience, expiresIn: '5m' });
    },
    async sign(claims: Record<string, unknown>, options: SignOptions = {}): Promise<string> {
      return signWith(claims, {
        issuer: options.issuer ?? issuer,
        audience: options.audience ?? audience,
        expiresIn: options.expiresIn ?? '5m',
        ...options,
      });
    },
    async close(): Promise<void> {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    },
  };
}

/** A second, independent key pair — a token signed by a key the JWKS does not publish. */
export async function foreignKey(): Promise<KeyLike> {
  const { privateKey } = await generateKeyPair('RS256', { extractable: true });
  return privateKey;
}

/**
 * Points the composition root's configuration at the fixture.
 *
 * `configureApp` reads the environment when it installs the guard, so this must run *before* the
 * spec boots its application — which is why it takes the fixture rather than reading it from a
 * module-level variable. `clearOidcEnv` is the counterpart for the one suite that must show what
 * an unconfigured deployment does.
 */
export function setOidcEnv(fixture: { jwksUri: string; issuer: string; audience: string }): void {
  process.env[OIDC_ENV.jwksUri] = fixture.jwksUri;
  process.env[OIDC_ENV.issuer] = fixture.issuer;
  process.env[OIDC_ENV.audience] = fixture.audience;
}

export function clearOidcEnv(): void {
  delete process.env[OIDC_ENV.jwksUri];
  delete process.env[OIDC_ENV.issuer];
  delete process.env[OIDC_ENV.audience];
}

/** The header a caller presents. Named once so a spec cannot spell the scheme differently. */
export function authorization(token: string): { authorization: string } {
  return { authorization: `Bearer ${token}` };
}
