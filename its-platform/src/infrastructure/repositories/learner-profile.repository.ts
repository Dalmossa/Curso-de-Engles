/**
 * A7b — the profile's four sources, read under the caller's own learner context (ADR-045 D1).
 *
 * `GET /learners/{learner_id}/profile` publishes five members, and four of them are one artefact
 * each: `cefr_level` is the `cefr` of the learner's **latest completed** `diagnostic_results` run
 * (ERD §2 correction 9; ADR-017 §3), `mastery` is `learner_mastery.p_know` keyed by `skill_id`,
 * `fsrs_states` is `fsrs_states` keyed by `item_id`, and `preferences` is not a table at all — it is
 * the document's own `default:` (D5), which is why it is answered by a constant and not by a query.
 * The fifth, `theta_estimates`, is **held** by D6 and read nowhere: θ and its `se` are H3's question
 * (ADR-043 R1), and a repository that read `theta_estimates` here would be answering a question the
 * platform has not decided — with a number, which is the one form an unanswered question must not
 * take.
 *
 * `created_at` is not read here either: it is a column of the row `LearnerScopeService` already
 * loaded for ADR-038 D3, and it travels on it (`VisibleLearner.created_at`). Reading it a second time
 * would be a second answer to one question.
 *
 * **Why every statement repeats `learner_id = $1` when a policy already filters by learner.** The two
 * predicates answer two different questions, exactly as `LearnerRepository.findById` records: the
 * policy decides whether the *caller* may see this learner's rows, and `$1` decides *which learner*
 * the request addressed. Under `withVisible` they can only ever name the same learner — the row could
 * not have been loaded otherwise — but dropping `$1` would change what the statement means, from
 * "this learner's rows" to "the caller's rows", and the two coincide only for as long as the caller
 * is never allowed to read somebody else's. That is the property the policy exists to hold, not an
 * assumption for a repository to lean on.
 *
 * **Every statement runs on the caller's `QueryRunner`, and there is no pool mode.** A read on a
 * pooled connection carries no learner context; under the policy that is zero rows rather than an
 * error, so a fallback would not fail — it would answer `{}` for a learner who has rows, which is a
 * lie shaped exactly like an empty profile. The parameter is therefore **required**, and this class
 * consequently takes no `DataSource`: its dependency is the transaction, not the pool. That makes it
 * the one repository in this directory without the `tx?: QueryRunner` shape, on purpose.
 *
 * The three statements are issued **in sequence, not concurrently**: a runner is one connection, and a
 * second statement in flight on it is a protocol error rather than a speedup. Three indexed lookups on
 * one connection are what this read costs.
 *
 * Types are normalised at this boundary, and only here: `NUMERIC` arrives as a string while the
 * contract declares `number`, so `p_know`, `stability` and `difficulty` are converted here rather than
 * at the handler — a handler that forgot would serve `"0.930"`, and the only thing that would notice
 * is a validator. `last_review` is a `timestamptz` and leaves as the RFC 3339 instant the contract's
 * `date-time` pattern describes.
 */

import { Injectable } from '@nestjs/common';
import type { QueryRunner } from 'typeorm';

/** One `fsrs_states` row, in the three members the contract declares as `required`. */
export interface FsrsStateSource {
  readonly stability: number;
  readonly difficulty: number;
  /** RFC 3339, `Z`-suffixed: `Date.prototype.toISOString`, never the driver's own rendering. */
  readonly last_review: string;
}

/** What the profile's four read members are a function of — every one of them read, not computed. */
export interface LearnerProfileSources {
  /** `diagnostic_results.cefr` of the latest completed run, or `null` when there is none (D3). */
  readonly cefr: string | null;
  /** `learner_mastery.p_know` keyed by `skill_id`: the keys are the learner's own skills. */
  readonly mastery: Record<string, number>;
  /** `fsrs_states` keyed by `item_id`. */
  readonly fsrsStates: Record<string, FsrsStateSource>;
}

@Injectable()
export class LearnerProfileRepository {
  /**
   * The four sources, for the learner the caller has already been allowed to see.
   *
   * `tx` is the transaction `LearnerScopeService.withVisible` opened: it carries the learner context
   * `PgSessionContext` writes (ADR-026 §1–2), so every statement below is evaluated under the same
   * context that decided the 404 — a foreign learner's rows are invisible here for the same reason
   * they were invisible to the load.
   */
  async read(learnerId: string, tx: QueryRunner): Promise<LearnerProfileSources> {
    // The latest run. "Latest" is the order `idx_diag_learner (learner_id, created_at DESC)` serves;
    // "completed" is a property of the table rather than a filter — `DiagnosticResultRepository`
    // writes a run's result row and its response rows in one transaction, so a row exists only when
    // the run finished. There is no `status` column to test against, and inventing one here would be
    // a second definition of "completed" (D3).
    const runs = (await tx.query(
      'SELECT cefr FROM diagnostic_results WHERE learner_id = $1 ORDER BY created_at DESC LIMIT 1',
      [learnerId],
    )) as Array<{ cefr: string }>;

    const masteryRows = (await tx.query(
      'SELECT skill_id, p_know FROM learner_mastery WHERE learner_id = $1 ORDER BY skill_id',
      [learnerId],
    )) as Array<{ skill_id: string; p_know: string }>;

    const fsrsRows = (await tx.query(
      'SELECT item_id, stability, difficulty, last_review FROM fsrs_states ' +
        'WHERE learner_id = $1 ORDER BY item_id',
      [learnerId],
    )) as Array<{ item_id: string; stability: string; difficulty: string; last_review: Date }>;

    const mastery: Record<string, number> = {};
    for (const row of masteryRows) {
      mastery[row.skill_id] = Number(row.p_know);
    }

    const fsrsStates: Record<string, FsrsStateSource> = {};
    for (const row of fsrsRows) {
      fsrsStates[row.item_id] = {
        stability: Number(row.stability),
        difficulty: Number(row.difficulty),
        last_review: row.last_review.toISOString(),
      };
    }

    return { cefr: runs[0]?.cefr ?? null, mastery, fsrsStates };
  }
}
