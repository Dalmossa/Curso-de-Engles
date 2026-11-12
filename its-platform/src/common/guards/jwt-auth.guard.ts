/**
 * `JwtAuthGuard` — the global guard `CONSTITUTION.md` §4.5 mandates, and the three answers it
 * inherits from ADR-038 D4.
 *
 * What it is registered as, and where, is the other half of this file: a guard that exists but is
 * not applied is exactly the state A0 measured (*"Zero guards. Não existe um único `@UseGuards` em
 * `src/`. 'Deny by default' não está implementado: hoje o default é **allow**."*). `configureApp`
 * installs it globally, which is the single place the composition root already applies the pipes
 * and the error filter — so the arrangement the integration tests boot is the one that ships.
 *
 * The decisions, in the order they must happen:
 *
 * 1. **`@Public()`** — §4.5's only opt-out. Checked first, so that ADR-038 D1's closed list
 *    (`GET /health`, `GET /ready`) cannot be widened by decorating a route twice.
 * 2. **A bearer token must be present and must verify** — else **401**. §4.5 is explicit that a
 *    missing or invalid token is never downgraded to "anonymous"; that downgrade is what makes
 *    an `@Public()` unnecessarily present on a route, and its absence impossible to notice.
 * 3. **The scopes the route declares must all be held** — else **403** (D4 row 1). This uses only
 *    the *route* and the token, never the object, so it cannot become an enumeration oracle:
 *    the same request receives the same 403 whether the addressed id exists or not.
 *
 * The body of a refusal is deliberately uniform. `401` for "no header" and `401` for "signature
 * does not verify" are the *same string*, because the difference is precisely what a prober
 * wants to learn (is this issuer even real?), and the per-case reason already lives in
 * `TokenVerificationError.reason` for the log line.
 *
 * What this guard deliberately does **not** do is D3: an object of another learner is not
 * addressed here. It is the RLS policy that decides, at the query, and the handler answers 404 —
 * `if (pathId === tokenSubject)` is the shape ADR-038 D3 rejects by name.
 *
 * The verifier arrives by injection and not by construction: the composition root supplies
 * whatever `token-verifier-from-env.ts` decided (`JwksTokenVerifier` against an external IdP, or
 * `LocalJwtTokenVerifier` when the platform is its own Authorization Server). A guard that built
 * its own verifier would have read the environment a second time, in a second place.
 */

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TOKEN_VERIFIER } from '../../modules/auth/tokens.js';

import { IS_PUBLIC_KEY } from '../auth/public.decorator.js';
import { REQUIRED_SCOPES_KEY } from '../auth/scopes.decorator.js';
import { TokenVerificationError, type TokenPrincipal, type TokenVerifier } from '../auth/token-principal.js';

/** Uniform per §4.5: the caller learns that authentication is required, and nothing more. */
const UNVERIFIED = 'A valid bearer token is required.';

/** D4 row 1: the caller may know a scope is missing; it learns nothing about the object. */
const UNAUTHORISED = 'This credential does not carry the authority the operation requires.';

const BEARER = /^Bearer\s+(\S+)$/i;

export interface AuthenticatedRequest {
  headers?: Record<string, string | string[] | undefined>;
  /** Set by this guard on success. Read through `@CurrentPrincipal()`. */
  principal?: TokenPrincipal;
}

function firstHeader(
  headers: AuthenticatedRequest['headers'],
  name: string,
): string | undefined {
  if (headers === undefined) return undefined;
  const wanted = name.toLowerCase();
  // Node lower-cases inbound header names, but a guard is also driven from tests and from a
  // future message-queue transport; RFC 9110 §5.1 makes the name case-insensitive, period.
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== wanted) continue;
    return Array.isArray(value) ? value[0] : value;
  }
  return undefined;
}

function bearerToken(request: AuthenticatedRequest): string | undefined {
  const raw = firstHeader(request.headers, 'authorization');
  if (raw === undefined) return undefined;
  return BEARER.exec(raw.trim())?.[1];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_VERIFIER) private readonly verifier: TokenVerifier,
    private readonly reflector: Reflector = new Reflector(),
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];

    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets) === true) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = bearerToken(request);
    if (token === undefined) throw new UnauthorizedException(UNVERIFIED);

    let principal: TokenPrincipal;
    try {
      principal = await this.verifier.verify(token);
    } catch (error) {
      // Fail closed on *any* verifier failure, including a JWKS that cannot be reached: an
      // outage is a denial, not a 5xx that might be retried into an authorisation.
      if (error instanceof TokenVerificationError) throw new UnauthorizedException(UNVERIFIED);
      throw new UnauthorizedException(UNVERIFIED);
    }

    const required = this.reflector.getAllAndOverride<readonly string[]>(REQUIRED_SCOPES_KEY, targets) ?? [];
    if (required.some((scope) => !principal.scopes.includes(scope))) {
      throw new ForbiddenException(UNAUTHORISED);
    }

    request.principal = principal;
    return true;
  }
}
