/**
 * ADR-026 — `PgSessionContext`, the single writer of `app.current_learner_id`.
 *
 * ADR-003's `learner_isolation` policy on every learner-scoped table is a predicate over the
 * session GUC `app.current_learner_id`. Nothing in the application set that GUC before this file,
 * which is why `DiagnosticResultRepository.persist()` could not write a row as the role the
 * process runs as (`its_platform_app`): PostgreSQL evaluated the policy to `false` and refused the
 * INSERT. The integration suite was green only because it connects as the table owner, and a
 * table's policies are not applied to its owner unless `FORCE ROW LEVEL SECURITY` is set.
 *
 * `data-model.erd.md` §9 rule 1 and `domain-model.md` §2.2 (X-4) already named this class:
 * `SET LOCAL app.current_learner_id = '<uuid>'` is issued **once per transaction** by
 * `PgSessionContext`, the single writer. This file is that rule executed — it is the only
 * application file allowed to name the GUC (the ADR-019 migration that *creates* the policies is
 * the other, and it is checked separately by `scripts/rls-context-check.mjs`).
 *
 * Three properties are load-bearing and none of them is incidental:
 *
 * 1. **The id is a bind parameter, never text.** The statement is
 *    `SELECT set_config('app.current_learner_id', $1, true)` — a literal `$1` and the value in the
 *    parameter array. Interpolating the id into the SQL would reopen exactly the injection surface
 *    ADR-003's policy exists to close.
 * 2. **`set_config`'s third argument is `true`.** That is the `is_local` flag, i.e. `SET LOCAL`:
 *    the context lives and dies with the transaction. Session scope (`false`, or a bare `SET`)
 *    survives `COMMIT` and therefore survives the connection's return to the pool; the next learner
 *    checked out on that connection would then have their `SELECT`s evaluated against a context
 *    they never set. Transaction scope makes the leak structurally impossible rather than
 *    forbidden by discipline (ADR-026 §3).
 * 3. **This class owns the transaction.** `SET LOCAL` outside a transaction block is a silent
 *    no-op, so the writer must be the thing that opened the transaction — which is why `work`
 *    receives the `QueryRunner` and why a repository must never call this itself (ADR-026 §2).
 *
 * The transaction is the boundary: commit on success, rollback on throw (rethrow), and `release()`
 * in `finally` so the connection always returns to the pool.
 */

import { Injectable } from '@nestjs/common';
import { DataSource, type QueryRunner } from 'typeorm';

/** The learner id is blank: refuse before opening a connection. A blank id must never reach the GUC. */
export class LearnerContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LearnerContextError';
  }
}

@Injectable()
export class PgSessionContext {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Run `work` inside one transaction whose `app.current_learner_id` GUC is set to `learnerId`.
   *
   * `work` receives the transaction's `QueryRunner` and does all its I/O through it, so every
   * statement — including the `INSERT`s of `DiagnosticResultRepository.persist` — is evaluated
   * against the caller's context and cannot observe another learner's rows.
   *
   * @throws LearnerContextError when `learnerId` is blank, before a connection is opened.
   */
  async withLearner<T>(learnerId: string, work: (tx: QueryRunner) => Promise<T>): Promise<T> {
    if (learnerId.trim() === '') {
      throw new LearnerContextError(
        'withLearner requires a non-blank learnerId; a blank id must never be written into ' +
          `app.current_learner_id`,
      );
    }

    const qr = this.dataSource.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();

      // The single writer. `$1` + `true` are not stylistic: `$1` keeps the id out of the SQL text,
      // and `true` (SET LOCAL) keeps the context inside this transaction only.
      await qr.query("SELECT set_config('app.current_learner_id', $1, true)", [learnerId]);

      const result = await work(qr);
      await qr.commitTransaction();
      return result;
    } catch (error) {
      if (qr.isTransactionActive) {
        await qr.rollbackTransaction();
      }
      throw error;
    } finally {
      await qr.release();
    }
  }
}
