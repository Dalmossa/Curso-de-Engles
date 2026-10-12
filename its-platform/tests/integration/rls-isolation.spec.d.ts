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
export {};
//# sourceMappingURL=rls-isolation.spec.d.ts.map