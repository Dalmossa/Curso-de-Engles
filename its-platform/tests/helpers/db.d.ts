import { DataSource } from 'typeorm';
import { PGlite } from '@electric-sql/pglite';
export interface TestDbContext {
    dataSource: DataSource;
    pglite?: PGlite;
    cleanup: () => Promise<void>;
}
/**
 * The integration harness. Two modes, selected by the environment:
 *
 * | mode | when | what `createTestDb()` returns |
 * |---|---|---|
 * | **PGlite** (default) | `TEST_DATABASE_URL` unset | an in-process `@electric-sql/pglite` instance with TypeORM's pg driver rewired onto it (ADR-014). `ctx.pglite` is the instance. |
 * | **real PostgreSQL 16** | `TEST_DATABASE_URL=postgres://user:pass@host:port/db` | a real `DataSource` connected to that URL. `ctx.pglite` is `undefined`. |
 *
 * The real mode exists because `CONSTITUTION.md` §4.8 requires tests that exercise RLS and
 * session GUCs to run against real PostgreSQL in CI, and PGlite cannot do everything the
 * policy needs (ADR-014's Binding constraint, narrowed by ADR-026 §5): it is a single
 * connection, so it cannot express a pooled connection, a second session, or lock contention.
 * The `rls-integration` CI job starts a `postgres:16-alpine` service and sets
 * `TEST_DATABASE_URL` to it; locally, any PostgreSQL 16 works — the harness drops and
 * recreates schema `public` and never touches another database.
 *
 * Both modes apply the same DDL — `SCHEMA_STATEMENTS` from the create-schema migration
 * (`src/migrations/1791331200000-create-schema.ts`), the single source of truth the migration
 * class and `scripts/migration-check.mjs` also consume — with the same per-statement
 * tolerance for idempotent-DDL errors. In real mode both `createTestDb()` *and* `cleanup()`
 * normalise the database to an empty `public` schema (the same `DROP SCHEMA … CASCADE` /
 * `CREATE SCHEMA public` pair), so every caller starts clean whether or not a previous step —
 * `scripts/migration-check.mjs`, another spec file, a crash — left tables and rows behind.
 *
 * The `CREATE ROLE` statements in `SCHEMA_STATEMENTS` are **cluster**-scoped, so they survive
 * the schema drop and fail with `role ... already exists` on every run after the first in the
 * same cluster. That is one of the errors the per-statement tolerance absorbs. (The migration
 * has no `IF NOT EXISTS`/`DO` guard for roles, so it is *not* idempotent for them; the tolerance
 * is the only reason a second run in one cluster works at all. Recorded in the ADR-026
 * follow-up report, not patched here — the harness must not edit the migration.)
 *
 * The interface is identical in both modes, and no caller reads `pglite`.
 *
 * Routes TypeORM's Postgres driver to an in-process PGlite instance (ADR-014).
 *
 * Two paths must both work, and only one of them is `DataSource.query()`:
 *
 *   1. `dataSource.query(sql)` — used by most specs.
 *   2. `dataSource.createQueryRunner()` + `qr.connect()` — used by the content
 *      loader. `PostgresQueryRunner.connect()` calls
 *      `driver.obtainMasterConnection()`, which is what previously threw
 *      `TypeORMError: Driver not Connected` because only path (1) was patched.
 *
 * The driver is rewired *before* `initialize()` so the real TCP socket is never
 * opened; `connect`/`obtainMasterConnection`/`obtainSlaveConnection` all hand
 * back the same PGlite-backed connection object.
 */
export declare function createTestDb(): Promise<TestDbContext>;
//# sourceMappingURL=db.d.ts.map