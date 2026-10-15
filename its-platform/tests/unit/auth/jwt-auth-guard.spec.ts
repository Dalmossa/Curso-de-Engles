/**
 * A5b — the guard `CONSTITUTION.md` §4.5 makes mandatory, and the answers ADR-038 D4 fixes.
 *
 * §4.5: *"Deny by default: `JwtAuthGuard` registered as a **global** guard; public routes opt out
 * explicitly via `@Public()`. Authorisation is a separate concern from authentication and is never
 * inferred from token validity alone."* A0 measured the state this suite exists to make
 * unreachable: **zero** `@UseGuards` in `src/`, so *"deny by default"* was false and the default
 * was **allow**.
 *
 * ADR-038 D4 fixes three answers, and each has cases below because each is a different mistake:
 *
 * | situation | answer | the mistake it prevents |
 * |---|---|---|
 * | no token / unverifiable token | **401** | falling back to "anonymous", which makes every `@Public()` implicit |
 * | token valid, scope missing | **403** | revealing something about the object |
 * | token valid, scope present | the handler runs | — |
 *
 * The verifier is a stub here on purpose: this file asserts **the guard's** decisions. That a real
 * RS256 signature, `iss`, `aud`, `exp` and the pinned algorithm are actually enforced is asserted
 * against the JWKS fixture in `tests/unit/auth/jwks-token-verifier.spec.ts` and end-to-end over
 * HTTP in `tests/integration/auth-guard.spec.ts`. A stub in both places would assert only that
 * something was called.
 */

import { ForbiddenException, UnauthorizedException, type ExecutionContext } from '@nestjs/common';

import { JwtAuthGuard } from '../../../src/common/guards/jwt-auth.guard.js';
import { Public } from '../../../src/common/auth/public.decorator.js';
import { Scopes } from '../../../src/common/auth/scopes.decorator.js';
import {
  TokenVerificationError,
  type TokenPrincipal,
  type TokenVerifier,
} from '../../../src/common/auth/token-principal.js';

const SUBJECT = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';

class Subject {
  @Public()
  public(): void {}

  plain(): void {}

  @Scopes('learner:self')
  self(): void {}

  @Scopes('learner:self', 'content:read')
  two(): void {}

  @Public()
  @Scopes('learner:self')
  both(): void {}
}

interface Stub {
  verifier: TokenVerifier;
  calls: string[];
}

function stubVerifier(behaviour: (token: string) => TokenPrincipal | Error): Stub {
  const calls: string[] = [];
  const verifier: TokenVerifier = {
    async verify(token: string): Promise<TokenPrincipal> {
      calls.push(token);
      const outcome = behaviour(token);
      if (outcome instanceof Error) throw outcome;
      return outcome;
    },
  };
  return { verifier, calls };
}

const PRINCIPAL: TokenPrincipal = {
  subject: '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d',
  scopes: ['learner:self'],
  claims: { sub: '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d', scope: 'learner:self' },
};

const handler = Subject.prototype.plain;

interface RequestLike {
  headers: Record<string, string | undefined>;
  principal?: TokenPrincipal;
}

function contextFor(
  routeHandler: () => void,
  request: RequestLike,
  controller: new () => unknown = Subject,
): ExecutionContext {
  return {
    getHandler: () => routeHandler,
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function guardFor(verifier: TokenVerifier): JwtAuthGuard {
  return new JwtAuthGuard(verifier);
}

describe('JwtAuthGuard — deny by default (§4.5)', () => {
  it('runs the handler for a valid token and attaches the principal to the request', async () => {
    const stub = stubVerifier(() => PRINCIPAL);
    const request: RequestLike = { headers: { authorization: 'Bearer good.token.here' } };

    await expect(guardFor(stub.verifier).canActivate(contextFor(handler, request))).resolves.toBe(
      true,
    );

    expect(stub.calls).toEqual(['good.token.here']);
    expect(request.principal).toEqual(PRINCIPAL);
  });

  it('accepts the header when its name arrives in a different case (RFC 9110 §5.1)', async () => {
    const stub = stubVerifier(() => PRINCIPAL);
    const request: RequestLike = { headers: { Authorization: 'Bearer good.token.here' } };

    await expect(guardFor(stub.verifier).canActivate(contextFor(handler, request))).resolves.toBe(
      true,
    );
  });

  it('refuses a request with no Authorization header', async () => {
    const stub = stubVerifier(() => PRINCIPAL);

    await expect(
      guardFor(stub.verifier).canActivate(contextFor(handler, { headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(stub.calls).toEqual([]);
  });

  it('refuses a credential that is not a bearer credential', async () => {
    const stub = stubVerifier(() => PRINCIPAL);

    await expect(
      guardFor(stub.verifier).canActivate(
        contextFor(handler, { headers: { authorization: 'Basic dXNlcjpwYXNz' } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(stub.calls).toEqual([]);
  });

  it('refuses a bearer credential carrying no token', async () => {
    const stub = stubVerifier(() => PRINCIPAL);

    await expect(
      guardFor(stub.verifier).canActivate(
        contextFor(handler, { headers: { authorization: 'Bearer' } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(stub.calls).toEqual([]);
  });

  it('refuses a token the verifier rejects', async () => {
    const stub = stubVerifier(() => new TokenVerificationError('signature does not verify'));

    await expect(
      guardFor(stub.verifier).canActivate(
        contextFor(handler, { headers: { authorization: 'Bearer bad' } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('answers the same thing for "no token" and "invalid token" — the response is not an oracle', async () => {
    const stub = stubVerifier(() => new TokenVerificationError('signature does not verify'));

    const absent = (await guardFor(stub.verifier)
      .canActivate(contextFor(handler, { headers: {} }))
      .catch((error: unknown) => error)) as UnauthorizedException;
    const invalid = (await guardFor(stub.verifier)
      .canActivate(contextFor(handler, { headers: { authorization: 'Bearer bad' } }))
      .catch((error: unknown) => error)) as UnauthorizedException;

    expect(absent).toBeInstanceOf(UnauthorizedException);
    expect(invalid).toBeInstanceOf(UnauthorizedException);
    expect(absent.message).toBe(invalid.message);
  });

  it.each([
    ['an empty string', ''],
    ['whitespace only', '   '],
  ])('refuses %s without consulting the verifier', async (_label, credential) => {
    const stub = stubVerifier(() => PRINCIPAL);

    await expect(
      guardFor(stub.verifier).canActivate(
        contextFor(handler, { headers: { authorization: `Bearer ${credential}` } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(stub.calls).toEqual([]);
  });

  it('hands a non-JWT string to the verifier: the shape of a token is the verifier’s business', async () => {
    // The boundary, stated as the obligation it is. `mock_access_token` is a JWT in no sense, and
    // the guard still passes it on — a guard that taught itself "a JWT has two dots" would refuse
    // tomorrow's token format and would be a second, weaker copy of the verifier's job. What the
    // guard owns is that *some* bearer credential was presented; what it means is below the line.
    const stub = stubVerifier(() => new TokenVerificationError('not a token'));

    await expect(
      guardFor(stub.verifier).canActivate(
        contextFor(handler, { headers: { authorization: 'Bearer mock_access_token' } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(stub.calls).toEqual(['mock_access_token']);
  });
});

describe('JwtAuthGuard — @Public() opts out explicitly (§4.5)', () => {
  it('lets a @Public() route through without consulting the verifier', async () => {
    const stub = stubVerifier(() => PRINCIPAL);

    await expect(
      guardFor(stub.verifier).canActivate(contextFor(Subject.prototype.public, { headers: {} })),
    ).resolves.toBe(true);
    expect(stub.calls).toEqual([]);
  });

  it('`@Public()` wins over a scope requirement on the same handler — the probes carry none', async () => {
    const stub = stubVerifier(() => PRINCIPAL);

    await expect(
      guardFor(stub.verifier).canActivate(contextFor(Subject.prototype.both, { headers: {} })),
    ).resolves.toBe(true);
    expect(stub.calls).toEqual([]);
  });
});

describe('JwtAuthGuard — a valid token is not authorisation (ADR-038 D2/D4)', () => {
  it('refuses a caller whose scopes do not include the route’s requirement', async () => {
    const stub = stubVerifier(() => ({ subject: '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d', scopes: ['content:read'], claims: {} }));

    await expect(
      guardFor(stub.verifier).canActivate(
        contextFor(Subject.prototype.self, {
          headers: { authorization: 'Bearer catalogue.only' },
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('refuses when only one of two required scopes is held', async () => {
    const stub = stubVerifier(() => PRINCIPAL);

    await expect(
      guardFor(stub.verifier).canActivate(
        contextFor(Subject.prototype.two, { headers: { authorization: 'Bearer good' } }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows a caller holding every required scope, and still attaches the principal', async () => {
    const stub = stubVerifier(() => ({
      ...PRINCIPAL,
      scopes: ['learner:self', 'content:read'],
    }));
    const request: RequestLike = { headers: { authorization: 'Bearer good' } };

    await expect(
      guardFor(stub.verifier).canActivate(contextFor(Subject.prototype.two, request)),
    ).resolves.toBe(true);
    expect(request.principal?.subject).toBe(PRINCIPAL.subject);
  });

  it('does not tell the caller which scope is missing', async () => {
    const stub = stubVerifier(() => ({ subject: PRINCIPAL.subject, scopes: [], claims: {} }));

    const error = (await guardFor(stub.verifier)
      .canActivate(
        contextFor(Subject.prototype.self, { headers: { authorization: 'Bearer good' } }),
      )
      .catch((thrown: unknown) => thrown)) as ForbiddenException;

    expect(error).toBeInstanceOf(ForbiddenException);
    expect(error.message).not.toContain('learner:self');
  });
});
