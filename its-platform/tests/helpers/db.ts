import { DataSource, type QueryRunner } from 'typeorm';
import { PGlite } from '@electric-sql/pglite';

export interface TestDbContext {
  dataSource: DataSource;
  pglite?: PGlite;
  cleanup: () => Promise<void>;
}

/**
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
