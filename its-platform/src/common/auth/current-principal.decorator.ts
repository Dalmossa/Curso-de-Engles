/**
 * `@CurrentPrincipal()` — how a handler reads who is calling (A5b).
 *
 * It exists so that a controller never touches the request object, and so that the two facts the
 * guard established (`subject`, `scopes`) have exactly one reader. `subject` is the value the
 * handler is **not** allowed to compare against a path parameter — ADR-038 D3 rejects that shape
 * by name; it is the value that goes into `PgSessionContext`, where the policy decides.
 *
 * Throwing here rather than returning `undefined` is deliberate. Reaching a handler without a
 * principal means the guard was not in front of it, which is the failure mode that must be loud:
 * a handler that received `undefined` and carried on would serve another learner's data.
 */

import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import type { TokenPrincipal } from './token-principal.js';

export const CurrentPrincipal = createParamDecorator(
  (_data: unknown, context: ExecutionContext): TokenPrincipal => {
    const request = context.switchToHttp().getRequest<{ principal?: TokenPrincipal }>();
    const principal = request.principal;
    if (principal === undefined) {
      throw new UnauthorizedException('A valid bearer token is required.');
    }
    return principal;
  },
);
