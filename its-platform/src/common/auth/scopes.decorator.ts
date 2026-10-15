/**
 * `@Scopes(...)` — what the route requires of a caller that is already authenticated (A5b).
 *
 * `CONSTITUTION.md` §4.5 separates the two concerns this file and `public.decorator.ts` divide
 * between them: *"Authorisation is a separate concern from authentication and is never inferred
 * from token validity alone."* `JwtAuthGuard` answers *"who is calling?"*; the metadata here is
 * what turns a verified caller into an **authorised** one, and a route that declares no scope
 * requires none — which is a decision, not an oversight, and one the contract records per
 * operation (ADR-040).
 *
 * The closed set is ADR-038 D2. It is declared once, here, as a type **and** a value, so that a
 * typo is a compile error rather than an operation nobody can reach:
 *
 * | scope | grants | holder |
 * |---|---|---|
 * | `content:read` | read the catalogue (`/content/*`) | learner |
 * | `learner:self` | read/write **only** one's own resources | learner |
 * | `learner:export` | export one's own data (LGPD 18 II/V) | learner |
 * | `learner:erase` | request erasure of one's own data (LGPD 18 IV/VI) | learner |
 * | `learners:read` | read a **named** learner's data | staff |
 * | `learners:admin` | operate on a named learner | staff |
 *
 * D2's last row is why `learners:read` is not a stronger `learner:self`: they are different
 * actors, and D6 requires the staff one to leave its own audit trail.
 *
 * The set may grow (additive) but a scope may not be removed without a breaking change — D2's
 * *Neutral* consequence, and the reason this is a union rather than a `string`.
 */

import { SetMetadata } from '@nestjs/common';

export const REQUIRED_SCOPES_KEY = 'its:required-scopes';

/** ADR-038 D2 — the whole set, in one place. */
export const SCOPES = {
  contentRead: 'content:read',
  learnerSelf: 'learner:self',
  learnerExport: 'learner:export',
  learnerErase: 'learner:erase',
  learnersRead: 'learners:read',
  learnersAdmin: 'learners:admin',
} as const;

export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

/** Every scope must be held; a caller holding some of them is not partially authorised. */
export const Scopes = (...scopes: readonly Scope[]): MethodDecorator & ClassDecorator =>
  SetMetadata(REQUIRED_SCOPES_KEY, scopes);
