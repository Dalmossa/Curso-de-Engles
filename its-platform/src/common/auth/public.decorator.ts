/**
 * `@Public()` — the *only* way a route opts out of authentication (A5b).
 *
 * `CONSTITUTION.md` §4.5: *"Deny by default: `JwtAuthGuard` registered as a **global** guard;
 * public routes opt out explicitly via `@Public()`."* The word doing the work is *explicitly*: a
 * route with no decorator is protected, and the set of public routes is a list a reader can count
 * rather than the complement of a list nobody maintains. ADR-038 D1 calls that list *"fechada e
 * curta"* and names exactly two members: the liveness and readiness probes.
 */

import { SetMetadata } from '@nestjs/common';

/** Metadata key. Exported so the guard and any future gate read one spelling. */
export const IS_PUBLIC_KEY = 'its:auth:public';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
