import { DataSource, type QueryRunner } from 'typeorm';
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
export async function createTestDb(): Promise<TestDbContext> {
  const migration = await import('../../src/migrations/1791331200000-create-schema');
  const SCHEMA_STATEMENTS = migration.SCHEMA_STATEMENTS;

  const realUrl = process.env['TEST_DATABASE_URL'];
  if (realUrl) {
    return createRealTestDb(realUrl, SCHEMA_STATEMENTS);
  }

  const pglite = new PGlite();

  const dataSource = new DataSource({
    type: 'postgres',
    url: 'postgres://test:test@localhost/test',
    synchronize: false,
    entities: [],
  });

  // The shape TypeORM expects from a `pg`-style connection. `PGlite.query()`
  // already returns `{ rows, fields, affectedRows }`, which is what
  // `PostgresQueryRunner.query()` destructures via `.rows`.
  //
  // `PostgresQueryRunner.connect()` also treats the connection as an
  // EventEmitter (`on`/`removeListener`), and `obtainMasterConnection()` must
  // resolve to a `[connection, release]` tuple — returning the bare connection
  // throws "object is not iterable" on destructuring.
  const connection = Object.assign(
    {
      query: async (sql: string, params?: unknown[]) => pglite.query(sql, params as unknown[]),
      release: () => {},
    },
    {
      on: () => connection,
      once: () => connection,
      removeListener: () => connection,
    },
  );

  const driver = dataSource.driver as unknown as Record<string, unknown>;
  const obtain = async () => [connection, () => {}] as const;
  driver['master'] = connection;
  driver['slaves'] = [];
  driver['isConnected'] = true;
  driver['connect'] = async () => connection;
  driver['afterConnect'] = async () => {};
  driver['disconnect'] = async () => {};
  driver['obtainMasterConnection'] = obtain;
  driver['obtainSlaveConnection'] = obtain;

  await dataSource.initialize();

  // `initialize()` may reset driver state fields it manages; re-assert after.
  driver['master'] = connection;
  driver['isConnected'] = true;
  driver['obtainMasterConnection'] = obtain;
  driver['obtainSlaveConnection'] = obtain;

  for (const stmt of SCHEMA_STATEMENTS) {
    try {
      await pglite.query(stmt);
    } catch {
      // The migration emits idempotent DDL; a duplicate-object error on re-run is expected.
    }
  }

  // The authentication tables are the second half of the canonical schema (33 tables), and they
  // come from migrations that use TypeORM's Table API rather than raw SQL — so the array above
  // does not contain them. Without them, a test that touches a learner's identity meets a
  // database without a `users` table. The widened `reuse_basis` CHECK (authored_material) is also
  // applied here, because SCHEMA_STATEMENTS predates that provenance value and a bank created
  // from scratch would reject the reauthorized lessons/packs.
  await applyAuthMigrations(dataSource, 'shim');

  const runner: QueryRunner = dataSource.createQueryRunner();
  if (runner) {
    await runner.release();
  }

  return {
    dataSource,
    pglite,
    cleanup: async () => {
      try {
        await dataSource.destroy();
      } catch {
        // ignore: the driver was never connected to a real socket
      }
      try {
        await pglite.close();
      } catch {
        // ignore
      }
    },
  };
}

/**
 * The migrations that are **not** part of `SCHEMA_STATEMENTS`, applied through TypeORM's own
 * runner.
 *
 * The canonical schema is 33 tables: 31 come from the create-schema migration's raw DDL, and the
 * two authentication tables (`users` and `user_sessions`) come from a migration that uses
 * TypeORM's Table API instead of raw SQL — so the array the harness applies does not contain them.
 * Until now the harness built only the first 31, and a test that touched a learner's identity met
 * a database without a `users` table.
 *
 * Three migrations are applied here outside `SCHEMA_STATEMENTS` (the comment below used to say
 * "the two authentication tables"/"two migrations" — now it is three):
 *   1. `CreateAuthTables1794508563775` — `users` + `user_sessions` (Table API).
 *   2. `AddPasswordResetColumns1802000000000` — `reset_token_hash` / `reset_token_expires_at` on `users`.
 *   3. `AllowAuthoredMaterialReuseBasis1804000000000` — widens the `reuse_basis` CHECK on `lessons`
 *      and `packs` to accept `authored_material`. SCHEMA_STATEMENTS predates that provenance value,
 *      so a bank created from scratch (PGlite/CI) would reject the reauthorized lessons/packs.
 *
 * These run **before** the `GRANT …` statements below, so the grants cover everything that exists.
 *
 * **`uuid_generate_v4()`** is the one thing PGlite cannot provide: the `uuid-ossp` extension is
 * not available there, and the canonical schema's own DDL uses `gen_random_uuid()` precisely
 * because of it. The `shim` mode gives the migration the function it asks for; the `extension`
 * mode asks real PostgreSQL for the extension, which is what the deployed database has.
 */
async function applyAuthMigrations(
  dataSource: DataSource,
  uuidGenerator: 'shim' | 'extension',
): Promise<void> {
  if (uuidGenerator === 'extension') {
    try {
      await dataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    } catch {
      // No permission to create the extension: the shim below covers the migration anyway.
    }
  } else {
    await dataSource.query(
      'CREATE OR REPLACE FUNCTION uuid_generate_v4() RETURNS uuid AS $$ SELECT gen_random_uuid() $$ LANGUAGE SQL;',
    );
  }

  const { CreateAuthTables1794508563775 } = await import(
    '../../src/migrations/1794508563775-1800000000001-create-auth-tables'
  );
  const { AddPasswordResetColumns1802000000000 } = await import(
    '../../src/migrations/1802000000000-add-password-reset-columns'
  );
  const { AllowAuthoredMaterialReuseBasis1804000000000 } = await import(
    '../../src/migrations/1804000000000-allow-authored-material-reuse-basis'
  );

  const runner = dataSource.createQueryRunner();
  await runner.connect();
  try {
    await new CreateAuthTables1794508563775().up(runner);
    await new AddPasswordResetColumns1802000000000().up(runner);
    await new AllowAuthoredMaterialReuseBasis1804000000000().up(runner);
  } finally {
    await runner.release();
  }

  // `GRANT … ON ALL TABLES` is a snapshot of the tables that exist **at that moment**, and the
  // grants in `SCHEMA_STATEMENTS` ran before these two existed — so they cannot have reached
  // them. The deployed database has the grants on `users`; the harness has to grant them again.
  //
  // The grant names the two tables **explicitly**: a blanket `ON ALL TABLES` would also re-grant
  // what the create-schema migration deliberately took back afterwards — `DELETE` on
  // `append_only_events`, `UPDATE (id)` on `items` — and the two guards that prove those
  // revokes would stop holding.
  for (const grant of [
    'GRANT SELECT, INSERT, UPDATE, DELETE ON users, user_sessions TO its_platform_app',
    'GRANT SELECT, INSERT, UPDATE, DELETE ON users, user_sessions TO its_platform_worker',
    'GRANT ALL ON users, user_sessions TO its_platform_admin',
  ]) {
    try {
      await dataSource.query(grant);
    } catch {
      // A role that does not exist in this deployment: the grant is not what this file measures.
    }
  }
}

/**
 * Real-PostgreSQL 16 mode (`TEST_DATABASE_URL` set).
 *
 * No driver patching: TypeORM's own `pg` driver opens a TCP connection to `url`, so every
 * mechanism PGlite cannot express — a pool, `SET ROLE`, `SET LOCAL`/`set_config` on a warm
 * connection, a second session — is the real one. This is the harness ADR-026's app-role tests
 * need and the one `CONSTITUTION.md` §4.8 asks CI for.
 *
 * The DDL is the same array, applied to `dataSource` instead of `pglite.query`, with the same
 * per-statement tolerance: the migration emits `IF NOT EXISTS`/`DO`-guarded DDL, and two of its
 * statements are not idempotent by construction —
 *
 *   * `CREATE ROLE its_platform_app|admin|worker NOLOGIN` is **cluster-scoped**: roles survive
 *     `cleanup()`'s `DROP SCHEMA public CASCADE`, so on the second `createTestDb()` of a run
 *     (the same spec file calls it twice, and CI may run several spec files) each raises
 *     `role "…" already exists`. The migration has no `IF NOT EXISTS`/`DO` guard for these
 *     (verified: `src/migrations/1791331200000-create-schema.ts` §11), so the tolerance is the
 *     only reason the second call succeeds. Recorded in the ADR-026 follow-up report rather
 *     than fixed here — the harness cannot change the migration.
 *   * every `CREATE TABLE`/`CREATE TYPE`/`CREATE POLICY`/`CREATE TRIGGER` on re-run.
 *
 * `cleanup()` is what makes each caller independent: `DROP SCHEMA IF EXISTS public CASCADE` +
 * `CREATE SCHEMA public` empties the database (tables, policies, triggers, enum types,
 * functions) without needing a superuser to drop the database, then `destroy()` returns the
 * pool's connections. The roles are deliberately left alone — `CREATE ROLE` runs on the next
 * call and its duplicate error is tolerated.
 */
async function createRealTestDb(
  url: string,
  SCHEMA_STATEMENTS: string[],
): Promise<TestDbContext> {
  const dataSource = new DataSource({
    type: 'postgres',
    url,
    synchronize: false,
    entities: [],
  });
  await dataSource.initialize();

  // Clean slate before the DDL, and again in `cleanup()`. This is not cosmetic: the step that
  // runs immediately before this one in CI is `scripts/migration-check.mjs`, which leaves the
  // 33 migrated tables and its fixture rows behind, and the spec's `seedCatalogues()` then dies
  // on `cefr_levels_sort_order_key` — its `ON CONFLICT (code) DO NOTHING` does not cover the
  // unique index on `sort_order`, which migration-check has already filled with 1,2. Dropping
  // the schema here is what makes "every `createTestDb()` caller gets a clean database" true
  // for the *first* caller too, not only for the one after a `cleanup()`.
  await dataSource.query('DROP SCHEMA IF EXISTS public CASCADE');
  await dataSource.query('CREATE SCHEMA public');

  for (const stmt of SCHEMA_STATEMENTS) {
    try {
      await dataSource.query(stmt);
    } catch {
      // The migration emits idempotent DDL; re-running it against a non-empty schema (a
      // duplicate table/type/trigger/policy, or a cluster-scoped role that already exists)
      // raises here and is expected. Same tolerance as the PGlite path.
    }
  }

  // The two authentication tables are the second half of the canonical schema (33 tables), and
  // they come from a migration that uses TypeORM's Table API rather than raw SQL — so the array
  // above does not contain them. Without them, a test that touches a learner's identity meets a
  // database without a `users` table.
  await applyAuthMigrations(dataSource, 'extension');

  return {
    dataSource,
    // `pglite` is deliberately omitted, not assigned `undefined`: `TestDbContext.pglite` is
    // optional and `exactOptionalPropertyTypes` forbids the explicit `undefined`. Reading it on
    // this path gives `undefined` either way, and no call site touches it.
    cleanup: async () => {
      try {
        await dataSource.query('DROP SCHEMA IF EXISTS public CASCADE');
        await dataSource.query('CREATE SCHEMA public');
      } finally {
        await dataSource.destroy();
      }
    },
  };
}
