/**
 * A5b — `LearnerRepository.findById`: the statement, and which connection it runs on.
 *
 * Two properties, both invisible at a glance and both load-bearing:
 *
 * 1. **The filter exists.** `WHERE id = $1` with the addressed id *bound* as a parameter. With the
 *    policy deciding visibility, it is tempting to read "the caller's own row" and drop the `WHERE`
 *    — it would still return a single row, and it would no longer be the row the URL named. A caller
 *    would read its own profile at somebody else's address and be answered `200`.
 * 2. **The read runs on the transaction it is given.** That transaction is the one whose
 *    `app.current_learner_id` was set (ADR-026 §2); a read on the pool would carry no context at all.
 *
 * The database is a duck-typed double here on purpose — the unit under test is the statement and the
 * choice of connection. That the policy really answers "no row" for another learner's id is asserted
 * against a real PostgreSQL (PGlite, with the connection's role and `SET ROLE` the app runs as) in
 * `tests/integration/learner-scope-rls.spec.ts`.
 */

import type { DataSource, QueryRunner } from 'typeorm';

import { LearnerRepository } from '../../../src/infrastructure/repositories/learner.repository.js';

/** The path parameter. Any uuid; the statement never inspects it. */
const ADDRESSED = '9b7e4a01-8c4d-1e2f-3a4b-5c6d3f2a1c44';
/** The row's own timestamp — the member `GET …/profile` publishes, and the reason it is selected. */
const CREATED_AT = new Date('2020-01-01T00:00:00Z');
/** The row's last active timestamp — the member `GET …/data-export` publishes (P1.16). */
const LAST_ACTIVE_AT = new Date('2024-06-15T12:00:00Z');

interface Call {
  readonly sql: string;
  readonly parameters: unknown[] | undefined;
  /** Where the call went: the caller's transaction, or the pool. */
  readonly destination: 'tx' | 'pool';
}

interface Harness {
  readonly repository: LearnerRepository;
  readonly calls: Call[];
  readonly tx: QueryRunner;
}

function harness(rows: Array<{ id: string; created_at: Date; last_active_at: Date | null }>): Harness {
  const calls: Call[] = [];
  const record =
    (destination: 'tx' | 'pool') =>
    (sql: string, parameters?: unknown[]): Promise<unknown> => {
      calls.push({ sql, parameters, destination });
      return Promise.resolve(rows);
    };

  const tx = { query: record('tx') } as unknown as QueryRunner;
  const dataSource = { query: record('pool') } as unknown as DataSource;

  return { repository: new LearnerRepository(dataSource), calls, tx };
}

describe('A5b — `LearnerRepository.findById`', () => {
  it('filters by the addressed id and binds it as a parameter', async () => {
    const h = harness([]);

    await h.repository.findById(ADDRESSED, h.tx);

    expect(h.calls).toHaveLength(1);
    // `$1`, not the literal: the id never enters the SQL text (the same reason `PgSessionContext`'s
    // `set_config` uses `$1`).
    expect(h.calls[0]?.sql).toBe('SELECT id, created_at, last_active_at FROM learners WHERE id = $1');
    expect(h.calls[0]?.parameters).toEqual([ADDRESSED]);
  });

  it('reads through the transaction it was given, and through nothing else', async () => {
    const h = harness([{ id: ADDRESSED, created_at: CREATED_AT, last_active_at: LAST_ACTIVE_AT }]);

    await h.repository.findById(ADDRESSED, h.tx);

    expect(h.calls.map((c) => c.destination)).toEqual(['tx']);
  });

  it('reads on the pool only when no transaction is supplied', async () => {
    const h = harness([{ id: ADDRESSED, created_at: CREATED_AT, last_active_at: LAST_ACTIVE_AT }]);

    await h.repository.findById(ADDRESSED);

    // Not an alternative path to the same row: with no `SET LOCAL` in effect, the policy's predicate
    // is false for every row, so the answer is `null`. The mode exists for callers that have no
    // context, and what it can see is nothing.
    expect(h.calls.map((c) => c.destination)).toEqual(['pool']);
  });

  it('answers null when the policy returns no row', async () => {
    const h = harness([]);

    await expect(h.repository.findById(ADDRESSED, h.tx)).resolves.toBeNull();
  });

  it('returns the row as it came back, without rewriting the id or the timestamp', async () => {
    const OTHER = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
    const h = harness([{ id: OTHER, created_at: CREATED_AT, last_active_at: LAST_ACTIVE_AT }]);

    // Both members, because A7b made `created_at` a served value: the profile publishes this column
    // and nothing else could, so a repository that dropped it would turn a fact back into a clock.
    // `last_active_at` is served by `GET …/data-export` (P1.16).
    await expect(h.repository.findById(ADDRESSED, h.tx)).resolves.toEqual({
      id: OTHER,
      created_at: CREATED_AT,
      last_active_at: LAST_ACTIVE_AT,
    });
  });
});
