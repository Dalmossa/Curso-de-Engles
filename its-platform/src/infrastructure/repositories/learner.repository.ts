/**
 * A5b — the learner-scoped read, and the reason a cross-learner request is a **404** (ADR-038 D3).
 *
 * The institution this file implements is one sentence long: *a row that exists but belongs to
 * another learner is not an error, it is invisible*. ADR-003's `learner_isolation` policy is a
 * predicate over the learner context ADR-026 §1 confines to a single writer, so `SELECT` on
 * `learners` returns the caller's own row and nothing else; a request that addresses someone else's
 * id returns **no row**, and "no row" is the only answer the edge can turn into the 404 ADR-038 D3
 * requires without ever asking *"is this id yours?"*.
 *
 * That is the whole point of doing it here rather than in a controller. D3 rejects the shape
 * `if (pathId === tokenSubject)` by name — it makes the edge the authority on ownership, it turns
 * each handler into a place where the rule can be forgotten, and it answers differently for an id
 * that does not exist and an id that belongs to someone else, which is the enumeration oracle
 * (`CONSTITUTION.md` §4.4/R6). With the policy deciding, both are the same 404 with the same body.
 *
 * The GUC is **not** set here. ADR-026 §2: `PgSessionContext` is the single writer, `SET LOCAL`
 * lives and dies with the transaction it owns, and a repository that set it would be a second
 * writer with a second lifetime. This class therefore takes the transaction as a parameter — the
 * `tx?: QueryRunner` shape every repository in this directory keeps — and the caller supplies one
 * that already carries the learner context.
 */

import { Injectable } from '@nestjs/common';
import { DataSource, type QueryRunner } from 'typeorm';

/**
 * What a caller may see of the addressed learner.
 *
 * Deliberately narrower than the DDL's row: `learners` also has `created_at`, `last_active_at` and
 * `updated_at`, and nothing in A5b reads them. A column that is selected but never consumed is a
 * claim about a consumer that does not exist (R2/R3), and the response bodies this read sits behind
 * are the stubs they were — the ratified scope of A5b is *"only the read the RLS governs"*, not the
 * profile aggregation (that is P1.10/P1.11).
 */
export interface VisibleLearner {
  readonly id: string;
}

@Injectable()
export class LearnerRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * The learner at `learnerId`, as **the current session context** is allowed to see it.
   *
   * Two predicates, two different questions, and both are needed:
   *
   * - `WHERE id = $1` — the object the request addresses (the path parameter). Without it, a caller
   *   with a learner context set would read *its own* row no matter which id it addressed, and a
   *   request for a stranger's profile would answer 200 with the caller's data.
   * - the policy — the caller. It is evaluated against the learner context the transaction carries,
   *   set from the token's `sub` by `PgSessionContext` (ADR-026 §1, ADR-038 D7).
   *
   * `null` therefore means *"not visible to this caller"* and never *"does not exist"*: the two are
   * indistinguishable here on purpose, and the caller must not try to tell them apart.
   *
   * When `tx` is omitted the read runs on a pooled connection with **no** learner context — inside a
   * policy that means `nullif(current_setting(…), '')` is NULL and the predicate is false for every
   * row, so the answer is `null`. That is fail-closed rather than convenient: a caller that forgot
   * the session context sees nothing instead of seeing everything. The `tx` parameter exists for
   * callers that have one (`PgSessionContext.withLearner` supplies it); the omitted form is honest
   * about what it can see.
   */
  async findById(learnerId: string, tx?: QueryRunner): Promise<VisibleLearner | null> {
    const sql = 'SELECT id FROM learners WHERE id = $1';

    const rows: Array<{ id: string }> =
      tx === undefined ? await this.dataSource.query(sql, [learnerId]) : await tx.query(sql, [learnerId]);

    const first = rows[0];
    return first === undefined ? null : { id: first.id };
  }
}
