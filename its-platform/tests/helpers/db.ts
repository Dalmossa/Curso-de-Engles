import { DataSource } from 'typeorm';
import { PGlite } from '@electric-sql/pglite';

export interface TestDbContext {
  dataSource: DataSource;
  pglite?: PGlite;
  cleanup: () => Promise<void>;
}

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

  // Monkey patch the driver BEFORE initialization
  const origInitialize = dataSource.initialize.bind(dataSource);
  dataSource.initialize = async function() {
    // Override the postgres driver to use pglite
    const drv = this.driver as any;
    if (drv.master) {
      drv.master.connect = async () => ({
        query: (sql: string, params?: any[]) => pglite.query(sql, params),
        release: () => {},
      });
    }
    drv.isConnected = true;
    (this as any).query = async (sql: string, params?: any[]) => {
      const res = await pglite.query(sql, params);
      return res.rows;
    };
    // Don't actually call the real initialize that tries to connect to postgres
    return this;
  };

  await dataSource.initialize();

  for (const stmt of SCHEMA_STATEMENTS) {
    try {
      await pglite.query(stmt);
    } catch (e) {
      // Ignore
    }
  }

  return {
    dataSource,
    pglite,
    cleanup: async () => {
      try {
        await dataSource.destroy();
      } catch (e) {}
      try {
        await pglite.close();
      } catch (e) {}
    },
  };
}
