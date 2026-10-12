/**
 * ADR-003 RLS — learner isolation and concurrency, in one file that runs (P2.1).
 *
 * **One file that actually runs beats three that do not.** This replaces three committed specs —
 * `rls-cross-learner.spec.ts` (f41c956), `rls-concurrency.spec.ts` (331cc50) and
 * `rls-boundary.spec.ts` (3c944d8) — none of which ever executed a single assertion, each for a
 * different reason, and every one of those reasons invisible while reading the file and obvious
 * the first time it was run:
 *
 * 1. **`dataSource.query()` has no `rowCount`.** `rls-cross-learner` asserted
 *    `expect(res.rowCount).toBe(0)` on a cross-learner UPDATE/DELETE. TypeORM's `query()` resolves
 *    to the row array — `[rows, affectedCount]` for DML — never to a `pg` `Result`, so the
 *    property is `undefined` and 4 tests failed against real PostgreSQL. A cross-learner write is
 *    therefore asserted by **reading the row back as the owner** before and after, the pattern
 *    `diagnostic-persistence.spec.ts` uses: the owner is the one role whose SELECT the policy
 *    cannot filter, so "unchanged" is measured, not inferred from a count that does not exist.
 * 2. **`PoolClient` is not `Client`.** `rls-concurrency` fed `pool.connect()`'s `PoolClient` into
 *    helpers typed `Client`; under `exactOptionalPropertyTypes: true` that is TS2379 and the whole
 *    suite was a compile error rather than a test. Every helper here takes `PoolClient`. The same
 *    file seeded `learners.cefr_level`, `learner_mastery.mastery` and
 *    `learner_mastery.last_updated` — none of which exist: the DDL is
 *    `learners(id, created_at, last_active_at, updated_at)` and `learner_mastery(…, p_know, …)`.
 *    Every column written in this file was read off
 *    `src/migrations/1791331200000-create-schema.ts` first.
 * 3. **`fsrs_parameters.w` has 21 elements.** `rls-boundary` seeded a 20-element `w` into a
 *    `CHECK (jsonb_array_length(w) = 21)` column and died inside `beforeEach`, so 9 tests never
 *    reached their first assertion. Nothing here seeds `fsrs_parameters` at all: the tests need
 *    only the shallowest FK graph — `learners`, `domains`, `skills`, `learner_mastery` — and no
 *    fixture is carried over from a spec that never ran.
 *
 * **Both modes, or it is not an RLS test.** The first `describe` runs everywhere the suite runs:
 * `createTestDb()` gives PGlite when `TEST_DATABASE_URL` is unset and real PostgreSQL 16 when it
 * is set. It switches to `its_platform_app` — the role the migration creates and the process
 * actually runs as — because a **table's owner bypasses its policies** unless `FORCE ROW LEVEL
 * SECURITY` is set, which no table here sets: a test left on the owner connection measures
 * nothing about ADR-003. PGlite is a single connection and cannot express a second session, so
 * the concurrency half is real-PostgreSQL-only and skipped cleanly otherwise.
 *
 * **Skip mechanism.** `hasRealDb` reads `TEST_DATABASE_URL` and nothing else. `DATABASE_URL` must
 * not enable it: the CI job sets `DATABASE_URL` for `scripts/migration-check.mjs` in the same
 * invocation that runs this suite, and a real-PostgreSQL describe evaluated against a PGlite
 * harness — or a PGlite describe against a cluster another step half-migrated — is how a suite in
 * this area came to be green on paper. `TEST_DATABASE_URL` is the harness's own switch
 * (`tests/helpers/db.ts`).
 *
 * **I-2 is enforced by `trg_item_id_immutable` (ADR-029), not by a grant.** A BEFORE UPDATE
 * trigger on `items` raises `items.id is immutable: % operation not allowed` when
 * `NEW.id IS DISTINCT FROM OLD.id` — chosen because a column-level REVOKE cannot carve a column
 * back out of a table-level GRANT (PostgreSQL ACLs have no negative entries — measured: no
 * `pg_attribute.attacl` row for `items`, `has_column_privilege` true, and the UPDATE rewrote the
 * primary key) and because a trigger covers **every** role, `its_platform_admin` and the table
 * owner included. The assertion for that control is in the first describe; it seeds an item with
 * no `item_options` children so the trigger's own exception is the only possible failure.
 */

import { DataSource, type QueryRunner } from 'typeorm';
import { Pool, type PoolClient } from 'pg';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import { PgSessionContext } from '../../src/infrastructure/persistence/pg-session-context.js';

/** Minted learner ids: A owns a row, B owns a row, and C owns nothing at all. */
const LEARNER_A = 'aaaaaaaa-aaaa-4111-8111-111111111111';
const LEARNER_B = 'bbbbbbbb-bbbb-4222-8222-222222222222';
const LEARNER_C = 'cccccccc-cccc-4333-8333-333333333333';

/** The single skill the mastery rows hang off; `skills.id` is `VARCHAR(50)`, not a uuid. */
const SKILL_ID = 'grammar.be';

/** The seeded values exactly as PostgreSQL renders `NUMERIC(4,3)` — the form the assertions read. */
const P_KNOW = { [LEARNER_A]: '0.500', [LEARNER_B]: '0.400' } as const;

/**
 * The real-PostgreSQL switch, and only that switch. `DATABASE_URL` alone must not enable the
 * second describe — see the header.
 */
const realDbUrl = process.env['TEST_DATABASE_URL'];
const hasRealDb = !!realDbUrl;
const maybeDescribe = hasRealDb ? describe : describe.skip;

/**
 * Seed the shallowest FK graph the assertions need — `learners`, `domains`, `skills`,
 * `learner_mastery` — with the real column names. A and B each own one mastery row; every other
 * row this file writes would be an unverified column, so there is none.
 */
async function seedLearnersAndMastery(dataSource: DataSource): Promise<void> {
  await dataSource.query(`INSERT INTO learners (id) VALUES ($1), ($2) ON CONFLICT (id) DO NOTHING`, [
    LEARNER_A,
    LEARNER_B,
  ]);
  await dataSource.query(
    `INSERT INTO domains (id, label, tracked) VALUES ('grammar', 'Grammar', true)
     ON CONFLICT (id) DO NOTHING`,
  );
  await dataSource.query(
    `INSERT INTO skills (id, domain_id, label) VALUES ($1, 'grammar', 'Be')
     ON CONFLICT (id) DO NOTHING`,
    [SKILL_ID],
  );
  await dataSource.query(
    `INSERT INTO learner_mastery (learner_id, skill_id, p_know)
     VALUES ($1, $3, $2), ($4, $3, $5)
     ON CONFLICT (learner_id, skill_id) DO NOTHING`,
    [LEARNER_A, P_KNOW[LEARNER_A], SKILL_ID, LEARNER_B, P_KNOW[LEARNER_B]],
  );
}

/**
 * Every learner-scoped row, read as the owner: `learner_id → p_know`. The owner connection is
 * outside every policy (`relforcerowsecurity` is false on all 15 tables), so this is the
 * unfiltered truth a cross-learner statement must not have changed.
 */
async function readMasteryAsOwner(dataSource: DataSource): Promise<Record<string, string>> {
  const rows = await dataSource.query(
    `SELECT learner_id, p_know::text AS p_know FROM learner_mastery ORDER BY learner_id`,
  );
  return Object.fromEntries(
    rows.map((row: { learner_id: string; p_know: string }) => [row.learner_id, row.p_know]),
  );
}

describe('ADR-003 RLS — one learner per transaction, as its_platform_app (P2.1)', () => {
  let dataSource: DataSource;
  let cleanup: () => Promise<void>;
  let sessionContext: PgSessionContext;

  beforeAll(async () => {
    const testDb = await createTestDb();
    dataSource = testDb.dataSource;
    cleanup = testDb.cleanup;
    sessionContext = new PgSessionContext(dataSource);
    await seedLearnersAndMastery(dataSource);
  });

  afterAll(async () => {
    await cleanup();
  });

  /**
   * The reference shape from `diagnostic-persistence.spec.ts`: the role is switched on the pooled
   * connection and `RESET ROLE` runs in a `finally`, so no test leaves the connection in another
   * role. The learner id goes in through `PgSessionContext` — ADR-026's single writer of
   * `app.current_learner_id` — never through string interpolation here.
   */
  async function asApp<T>(learnerId: string, work: (tx: QueryRunner) => Promise<T>): Promise<T> {
    await dataSource.query(`SET ROLE its_platform_app`);
    try {
      return await sessionContext.withLearner(learnerId, work);
    } finally {
      await dataSource.query(`RESET ROLE`);
    }
  }

  /**
   * Role and GUC in one hand-built transaction on one connection.
   *
   * This exists for the two tests that measure a context `PgSessionContext` refuses to *produce*:
   * it throws `LearnerContextError` on a blank id before opening a connection and trims before
   * writing, so `''` and `'   '` can never come from the writer. What they still need measuring is
   * the policy's own behaviour under a context a caller might construct another way — which is
   * exactly what `nullif(…, '')::uuid` decides.
   */
  async function asAppWithRawContext<T>(
    gucValue: string,
    work: (tx: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const qr = dataSource.createQueryRunner();
    await qr.connect();
    try {
      await qr.query(`SET ROLE its_platform_app`);
      await qr.startTransaction();
      await qr.query(`SELECT set_config('app.current_learner_id', $1, true)`, [gucValue]);
      const result = await work(qr);
      await qr.commitTransaction();
      return result;
    } finally {
      // Roll the transaction back before the role: in an aborted transaction every command but
      // ROLLBACK is refused, and `SET ROLE` above was issued outside it, so it survives.
      if (qr.isTransactionActive) await qr.rollbackTransaction();
      await qr.query(`RESET ROLE`);
      await qr.release();
    }
  }

  it('exposes 15 RLS-enabled tables and 45 policies, three per table', async () => {
    const [tables] = await dataSource.query(
      `SELECT count(*)::int AS n
         FROM pg_class c
         JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity`,
    );
    expect(tables.n).toBe(15);

    const byName = await dataSource.query(
      `SELECT p.polname AS name, count(*)::int AS n
         FROM pg_policy p
         JOIN pg_class c ON c.oid = p.polrelid
         JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
        GROUP BY p.polname
        ORDER BY p.polname`,
    );
    // Not just the total: 45 is 15 × {learner_isolation, admin_bypass, worker_access}. A count
    // alone cannot tell that shape from 45 policies on one table.
    expect(byName).toEqual([
      { name: 'admin_bypass', n: 15 },
      { name: 'learner_isolation', n: 15 },
      { name: 'worker_access', n: 15 },
    ]);
  });

  it('returns 0 rows for a cross-learner SELECT under both predicate shapes, and its own row', async () => {
    const seen = await asApp(LEARNER_A, async tx => ({
      // `learners` is the one table whose predicate column is `id`…
      ownLearners: (await tx.query(`SELECT id FROM learners ORDER BY id`)).map(
        (row: { id: string }) => row.id,
      ),
      crossLearners: (
        await tx.query(`SELECT count(*)::int AS n FROM learners WHERE id = $1`, [LEARNER_B])
      )[0].n,
      // …and the other 14 use `learner_id`.
      ownMastery: (
        await tx.query(`SELECT learner_id FROM learner_mastery ORDER BY learner_id`)
      ).map((row: { learner_id: string }) => row.learner_id),
      crossMastery: (
        await tx.query(`SELECT count(*)::int AS n FROM learner_mastery WHERE learner_id = $1`, [
          LEARNER_B,
        ])
      )[0].n,
    }));

    expect(seen.ownLearners).toEqual([LEARNER_A]);
    expect(seen.ownMastery).toEqual([LEARNER_A]);
    expect(seen.crossLearners).toBe(0);
    expect(seen.crossMastery).toBe(0);
  });

  it("leaves another learner's row untouched under a cross-learner UPDATE, while its own row is updateable", async () => {
    const before = await readMasteryAsOwner(dataSource);
    expect(before).toEqual({ [LEARNER_A]: P_KNOW[LEARNER_A], [LEARNER_B]: P_KNOW[LEARNER_B] });

    await asApp(LEARNER_A, async tx => {
      // Not an error, and not a change: the policy filters the row out of the UPDATE's scope, so
      // the statement succeeds with nothing in it. `dataSource.query()` offers no count for that,
      // which is why "nothing happened" is measured as the value below.
      await tx.query(`UPDATE learner_mastery SET p_know = 0.999 WHERE learner_id = $1`, [LEARNER_B]);
      // Positive control: the app role is not merely read-only on its own learner.
      await tx.query(`UPDATE learner_mastery SET p_know = 0.750 WHERE learner_id = $1`, [LEARNER_A]);
    });

    const after = await readMasteryAsOwner(dataSource);
    expect(after[LEARNER_B]).toBe(P_KNOW[LEARNER_B]);
    expect(after[LEARNER_A]).toBe('0.750');
  });

  it("leaves another learner's rows present under a cross-learner DELETE", async () => {
    await asApp(LEARNER_A, async tx => {
      await tx.query(`DELETE FROM learner_mastery WHERE learner_id = $1`, [LEARNER_B]);
      // A `learners` DELETE would cascade into B's mastery row, so it is the sharpest single
      // check that the `id` predicate also refuses a cross-learner write.
      await tx.query(`DELETE FROM learners WHERE id = $1`, [LEARNER_B]);
    });

    const after = await readMasteryAsOwner(dataSource);
    expect(after).toEqual({ [LEARNER_A]: '0.750', [LEARNER_B]: P_KNOW[LEARNER_B] });

    const [learners] = await dataSource.query(`SELECT count(*)::int AS n FROM learners`);
    expect(learners.n).toBe(2);
  });

  it('refuses a cross-learner INSERT — WITH CHECK is the write half of the policy', async () => {
    await expect(
      asApp(LEARNER_A, tx =>
        tx.query(`INSERT INTO learner_mastery (learner_id, skill_id, p_know) VALUES ($1, $2, 0.500)`, [
          LEARNER_B,
          SKILL_ID,
        ]),
      ),
    ).rejects.toThrow(/row-level security policy/);

    const rows = await dataSource.query(
      `SELECT learner_id FROM learner_mastery ORDER BY learner_id`,
    );
    expect(rows.map((row: { learner_id: string }) => row.learner_id)).toEqual([
      LEARNER_A,
      LEARNER_B,
    ]);
  });

  it('treats an empty app.current_learner_id as no context: 0 rows, not an error', async () => {
    const seen = await asAppWithRawContext('', async tx => ({
      learners: (await tx.query(`SELECT count(*)::int AS n FROM learners`))[0].n,
      mastery: (await tx.query(`SELECT count(*)::int AS n FROM learner_mastery`))[0].n,
    }));

    // `nullif(current_setting('app.current_learner_id', true), '')` turns the post-COMMIT
    // placeholder — the empty string on every warm connection — into NULL, and `col = NULL` is
    // NULL rather than an error or a match.
    expect(seen).toEqual({ learners: 0, mastery: 0 });

    // The 0 is not vacuous: the rows are there for a role the policy does not apply to.
    const [owner] = await dataSource.query(`SELECT count(*)::int AS n FROM learner_mastery`);
    expect(owner.n).toBe(2);
  });

  it('raises on a context nullif cannot neutralise: a malformed UUID, and whitespace the writer trims', async () => {
    await expect(
      asAppWithRawContext('not-a-uuid', tx =>
        tx.query(`SELECT count(*)::int AS n FROM learner_mastery`),
      ),
    ).rejects.toThrow(/invalid input syntax for type uuid/);

    // Measured, and the reason `PgSessionContext.withLearner` tests `learnerId.trim() === ''`
    // before it opens a connection: `nullif(x, '')` neutralises exactly the empty string, so a
    // whitespace-only id reaches the cast and raises instead of quietly matching nothing.
    await expect(
      asAppWithRawContext('   ', tx => tx.query(`SELECT count(*)::int AS n FROM learner_mastery`)),
    ).rejects.toThrow(/invalid input syntax for type uuid/);
  });

  it('lets its_platform_admin read across learners, with no learner context set', async () => {
    await dataSource.query(`SET ROLE its_platform_admin`);
    try {
      const rows = await dataSource.query(
        `SELECT learner_id FROM learner_mastery ORDER BY learner_id`,
      );
      expect(rows.map((row: { learner_id: string }) => row.learner_id)).toEqual([
        LEARNER_A,
        LEARNER_B,
      ]);

      const [guc] = await dataSource.query(
        `SELECT current_setting('app.current_learner_id', true) AS ctx`,
      );
      expect(guc.ctx).not.toBe(LEARNER_A);
    } finally {
      await dataSource.query(`RESET ROLE`);
    }
  });

  it('lets its_platform_worker read across learners, with no learner context set', async () => {
    await dataSource.query(`SET ROLE its_platform_worker`);
    try {
      const rows = await dataSource.query(
        `SELECT learner_id FROM learner_mastery ORDER BY learner_id`,
      );
      expect(rows.map((row: { learner_id: string }) => row.learner_id)).toEqual([
        LEARNER_A,
        LEARNER_B,
      ]);
    } finally {
      await dataSource.query(`RESET ROLE`);
    }
  });

  it('makes append_only_events UPDATE/DELETE impossible for every role, not just the app role', async () => {
    await dataSource.query(
      `INSERT INTO append_only_events (event_type, payload, learner_id)
       VALUES ('session_start', '{}', $1)`,
      [LEARNER_A],
    );

    // As the owner the REVOKEs do not apply at all — the guard trigger is the only thing standing
    // here, and it is what makes the WORM property hold for a role the migration also grants.
    await expect(
      dataSource.query(`UPDATE append_only_events SET payload = '{"tampered":true}' WHERE learner_id = $1`, [
        LEARNER_A,
      ]),
    ).rejects.toThrow(/immutable/);
    await expect(
      dataSource.query(`DELETE FROM append_only_events WHERE learner_id = $1`, [LEARNER_A]),
    ).rejects.toThrow(/immutable/);

    // The app role is stopped one layer earlier, at the table grant: it holds `arw`, no `d`.
    await dataSource.query(`SET ROLE its_platform_app`);
    try {
      await expect(
        dataSource.query(`UPDATE append_only_events SET payload = '{}'`),
      ).rejects.toThrow(/permission denied/);
      await expect(dataSource.query(`DELETE FROM append_only_events`)).rejects.toThrow(
        /permission denied/,
      );
    } finally {
      await dataSource.query(`RESET ROLE`);
    }

    const rows = await dataSource.query(`SELECT payload FROM append_only_events`);
    expect(rows).toHaveLength(1);
    expect(rows[0].payload).toEqual({});
  });

  /**
   * ADR-029 I-2 — `items.id` is immutable for **every** role because `trg_item_id_immutable`
   * is a trigger, not a grant. The old column-level `REVOKE UPDATE (id) ON items` was inert
   * (PostgreSQL ACLs have no negative entries), and the gate that used to "prove" I-2 was
   * fooled by its own fixture: the seeded `item_options` children made the UPDATE fail with a
   * **foreign-key** error before privileges (or the trigger) were ever consulted. This fixture
   * therefore seeds an item with **no** children, so the only possible failure is the trigger.
   */
  it('makes items.id immutable for the owner and the app role alike — trg_item_id_immutable (ADR-029, I-2)', async () => {
    // `items` is not one of the 15 learner-scoped RLS tables — no `app.current_learner_id`
    // needed to write or read it; the app role's view is the owner's view.
    // `cefr_level` is an FK into `cefr_levels(code)` (seeded here), `domain_id` into
    // `domains(id)` (seeded in `beforeAll`), and `provenance_kind` is NOT NULL with no default.
    await dataSource.query(
      `INSERT INTO cefr_levels (code, label, sort_order) VALUES ('A1', 'A1', 0)
       ON CONFLICT (code) DO NOTHING`,
    );
    await dataSource.query(
      `INSERT INTO items (id, skill_ids, cefr_level, domain_id, item_type, modality, p_random,
                          stem, provenance_kind)
       VALUES ($1, ARRAY['grammar.be']::text[], 'A1', 'grammar', 'form_selection', 'text',
               0.5, $2, 'authored')
       ON CONFLICT (id) DO NOTHING`,
      ['it_i2_seed', 'seed stem'],
    );

    // The all-role proof, and the half no grant-based control could ever pass: even the
    // connection owner — the role every REVOKE in the migration leaves untouched — is stopped.
    await expect(
      dataSource.query(`UPDATE items SET id = 'it_i2_hacked' WHERE id = 'it_i2_seed'`),
    ).rejects.toThrow(/immutable/);

    await dataSource.query(`SET ROLE its_platform_app`);
    try {
      // The app role is stopped by the trigger too (it holds a table-level UPDATE grant, so
      // this is the trigger's exception, not a grant error).
      await expect(
        dataSource.query(`UPDATE items SET id = 'it_i2_hacked' WHERE id = 'it_i2_seed'`),
      ).rejects.toThrow(/immutable/);

      // The trigger is narrow: the identifier is immutable, the rest of the row is not.
      await expect(
        dataSource.query(`UPDATE items SET stem = 'replaced stem' WHERE id = 'it_i2_seed'`),
      ).resolves.toBeDefined();

      // DELETE stays a grant question: `REVOKE DELETE ON items` is table-level and holds, so
      // the app role is refused with a permission error — a different mechanism, a different
      // message, and not the trigger's to raise.
      await expect(
        dataSource.query(`DELETE FROM items WHERE id = 'it_i2_seed'`),
      ).rejects.toThrow(/permission denied/);
    } finally {
      await dataSource.query(`RESET ROLE`);
    }
  });
});

/**
 * The concurrency half — two independent connections, which PGlite cannot express.
 *
 * Skipped unless `TEST_DATABASE_URL` is set: `DATABASE_URL` is not the switch (see the header).
 * Each session gets its own pooled connection, its own `SET ROLE its_platform_app` and its own
 * `SET LOCAL`-equivalent `set_config(…, true)` inside its own transaction; the learner id is
 * transaction-scoped, so two sessions can hold two different learners at the same time without
 * one overwriting the other.
 *
 * `rowCount` is asserted here because these statements go through `pg` directly — the `PoolClient`
 * of a real connection returns a real `Result`. `dataSource.query()` cannot (see defect 1 in the
 * header), which is why the first describe reads rows back instead.
 */
maybeDescribe('ADR-003 RLS — two app-role sessions at once (real PostgreSQL only)', () => {
  let context: TestDbContext;
  let dataSource: DataSource;
  let pool: Pool;

  beforeAll(async () => {
    if (!realDbUrl) {
      // Unreachable while the describe is skipped; a fail-closed guard rather than a silent
      // re-point at whatever DATABASE_URL happens to name.
      throw new Error('TEST_DATABASE_URL is required for the concurrency describe');
    }
    context = await createTestDb();
    dataSource = context.dataSource;
    pool = new Pool({ connectionString: realDbUrl });
    await seedLearnersAndMastery(dataSource);
  });

  afterAll(async () => {
    await pool.end();
    await context.cleanup();
  });

  /** One app-role session: its own connection, its own transaction, its own learner context. */
  async function openAppSession(learnerId: string): Promise<PoolClient> {
    const client = await pool.connect();
    await client.query(`SET ROLE its_platform_app`);
    await client.query(`BEGIN`);
    await client.query(`SELECT set_config('app.current_learner_id', $1, true)`, [learnerId]);
    return client;
  }

  /**
   * Commits, then restores the connection before it goes back to the pool. Committing matters:
   * a cross-owner statement that matched nothing commits nothing, so the owner read-back after
   * the test is evidence about a statement that really ran and really committed.
   */
  async function closeAppSession(client: PoolClient): Promise<void> {
    try {
      await client.query(`COMMIT`);
    } finally {
      await client.query(`RESET ROLE`);
      client.release();
    }
  }

  async function countMasteryRows(client: PoolClient): Promise<number | undefined> {
    const result = await client.query<{ n: number }>(`SELECT count(*)::int AS n FROM learner_mastery`);
    return result.rows[0]?.n;
  }

  it("does not leak one learner's rows into another concurrent app-role session", async () => {
    const a = await openAppSession(LEARNER_A);
    const b = await openAppSession(LEARNER_B);
    try {
      const [ra, rb] = await Promise.all([
        a.query<{ learner_id: string }>(`SELECT learner_id FROM learner_mastery ORDER BY learner_id`),
        b.query<{ learner_id: string }>(`SELECT learner_id FROM learner_mastery ORDER BY learner_id`),
      ]);

      expect(ra.rows.map(row => row.learner_id)).toEqual([LEARNER_A]);
      expect(rb.rows.map(row => row.learner_id)).toEqual([LEARNER_B]);
    } finally {
      await Promise.all([closeAppSession(a), closeAppSession(b)]);
    }
  });

  it("leaves both rows untouched when each session UPDATEs the other's row concurrently", async () => {
    const a = await openAppSession(LEARNER_A);
    const b = await openAppSession(LEARNER_B);
    let crossA: number | null = null;
    let crossB: number | null = null;
    try {
      const [ua, ub] = await Promise.all([
        a.query(`UPDATE learner_mastery SET p_know = 0.999 WHERE learner_id = $1`, [LEARNER_B]),
        b.query(`UPDATE learner_mastery SET p_know = 0.999 WHERE learner_id = $1`, [LEARNER_A]),
      ]);
      crossA = ua.rowCount;
      crossB = ub.rowCount;
    } finally {
      await Promise.all([closeAppSession(a), closeAppSession(b)]);
    }

    expect(crossA).toBe(0);
    expect(crossB).toBe(0);

    // The count and the stored value have to agree: 0 rows affected, and the value it would have
    // changed is still the one that was seeded. The owner read runs after both COMMITs.
    expect(await readMasteryAsOwner(dataSource)).toEqual({
      [LEARNER_A]: P_KNOW[LEARNER_A],
      [LEARNER_B]: P_KNOW[LEARNER_B],
    });
  });

  it("deletes nothing when each session DELETEs the other's row concurrently", async () => {
    const a = await openAppSession(LEARNER_A);
    const b = await openAppSession(LEARNER_B);
    let delA: number | null = null;
    let delB: number | null = null;
    try {
      const [da, db] = await Promise.all([
        a.query(`DELETE FROM learner_mastery WHERE learner_id = $1`, [LEARNER_B]),
        b.query(`DELETE FROM learner_mastery WHERE learner_id = $1`, [LEARNER_A]),
      ]);
      delA = da.rowCount;
      delB = db.rowCount;
    } finally {
      await Promise.all([closeAppSession(a), closeAppSession(b)]);
    }

    expect(delA).toBe(0);
    expect(delB).toBe(0);

    const [count] = await dataSource.query(`SELECT count(*)::int AS n FROM learner_mastery`);
    expect(count.n).toBe(2);
  });

  it("keeps each connection's learner context its own when one of them switches", async () => {
    const a = await openAppSession(LEARNER_A);
    const b = await openAppSession(LEARNER_B);
    try {
      const [aBefore, bBefore] = await Promise.all([countMasteryRows(a), countMasteryRows(b)]);
      expect(aBefore).toBe(1);
      expect(bBefore).toBe(1);

      // A third learner who owns nothing: the same connection, a new context, in place.
      await a.query(`SELECT set_config('app.current_learner_id', $1, true)`, [LEARNER_C]);

      const [aAfter, bAfter] = await Promise.all([countMasteryRows(a), countMasteryRows(b)]);
      expect(aAfter).toBe(0);
      // B's view is untouched by A's switch — the leak the transaction-scoped GUC exists to make
      // impossible (ADR-026 §3).
      expect(bAfter).toBe(1);
    } finally {
      await Promise.all([closeAppSession(a), closeAppSession(b)]);
    }
  });
});
