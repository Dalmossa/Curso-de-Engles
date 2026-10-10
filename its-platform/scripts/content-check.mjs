#!/usr/bin/env node
// ---------------------------------------------------------------------------
// P0.5 acceptance gate: seed the content graph into PGlite (or a real Postgres
// when DATABASE_URL is set) and assert the loader's output.
//
// DEFECT FIXED 2026-10-10 — this gate could not fail.
// `loadContent()` calls `queryRunner.connect()`, which TypeORM implements as
//   driver.obtainMasterConnection().then(([connection, release]) => ...)
// and PostgresDriver.obtainMasterConnection() invokes `this.master.connect(cb)`.
// The harness here set
//   drv.master = { connect: async () => ({ ... }) }
// — an *async* function, so the callback was never called. The promise never
// settled, `loadContent()` never returned, the event loop drained, and Node
// exited **0** without ever reaching a single assertion (EXPECTED_SKIP_COUNT
// included). Every "content-check PASS" recorded against P0.5/P0.8 was therefore
// vacuous. The harness below now supplies a callback-style connection and the
// loader call is raced against a hard timeout, so a hang fails instead of
// passing.
// ---------------------------------------------------------------------------
import { PGlite } from '@electric-sql/pglite';
import { SCHEMA_STATEMENTS } from '../src/migrations/1791331200000-create-schema.ts';
import { loadContent } from '../dist/infrastructure/content/content-loader.js';
import { DataSource } from 'typeorm';

const EXPECTED_SKIP_COUNT = 16;
const LOAD_TIMEOUT_MS = 120_000;
const CONTENT_REPO_PATH = process.env.CONTENT_REPO_PATH || '/home/dalmo/Documentos/Projetos/Curso-de-Ingles';

async function loadWithTimeout(ds, root) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`loadContent() did not settle within ${LOAD_TIMEOUT_MS}ms`)),
      LOAD_TIMEOUT_MS,
    );
  });
  try {
    return await Promise.race([loadContent(ds, root), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

function assertReport(report) {
  const skips = Array.isArray(report.skips) ? report.skips : [];
  if (report.errors && report.errors.length > 0) {
    console.error(`FAIL: loader reported ${report.errors.length} error(s):`);
    for (const e of report.errors.slice(0, 10)) console.error(`  - ${e}`);
    return 1;
  }
  if (skips.length !== EXPECTED_SKIP_COUNT) {
    console.error(`FAIL: expected ${EXPECTED_SKIP_COUNT} skips, got ${skips.length}`);
    for (const s of skips.slice(0, 10)) console.error(`  - ${s}`);
    return 1;
  }
  return 0;
}

async function run() {
  try {
    if (process.env.DATABASE_URL) {
      const ds = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: false,
        synchronize: false,
      });
      await ds.initialize();
      for (const stmt of SCHEMA_STATEMENTS) {
        try {
          await ds.query(stmt);
        } catch {
          // Idempotent DDL: duplicate-object errors on re-run are expected.
        }
      }
      const report = await loadWithTimeout(ds, CONTENT_REPO_PATH);
      const failed = assertReport(report);
      if (failed) process.exit(1);
      console.log('PASS');
      await ds.destroy();
      return;
    }

    const pglite = new PGlite();
    const ds = new DataSource({ type: 'postgres', url: 'postgres://x:x@x:5432/x', synchronize: false });
    try {
      await ds.initialize();
    } catch {
      // expected: no real server is reachable; the driver is wired to PGlite below
    }

    const drv = ds.driver;
    // `pg`-style connection. PostgresQueryRunner treats it as an EventEmitter and
    // expects `obtainMasterConnection()` to resolve to a [connection, release] tuple.
    const connection = Object.assign(
      {
        query: (s, p) => pglite.query(s, p),
        release: () => {},
      },
      {
        on: () => connection,
        once: () => connection,
        removeListener: () => connection,
      },
    );
    const obtain = async () => [connection, () => {}];
    drv.master = { connect: (cb) => cb(null, connection, () => {}) };
    drv.isConnected = true;
    drv.obtainMasterConnection = obtain;
    drv.obtainSlaveConnection = obtain;

    for (const stmt of SCHEMA_STATEMENTS) {
      try {
        await pglite.query(stmt);
      } catch {
        // Idempotent DDL: duplicate-object errors on re-run are expected.
      }
    }

    ds.query = async (sql, params) => (await pglite.query(sql, params)).rows;
    const report = await loadWithTimeout(ds, CONTENT_REPO_PATH);
    const failed = assertReport(report);
    if (failed) process.exit(1);
    console.log(
      JSON.stringify({
        lessons: report.lessons,
        packs: report.packs,
        dialogues: report.dialogues,
        slots: report.slots,
        items: report.items,
        skips: (report.skips || []).length,
      }),
    );
    await ds.destroy();
  } catch (err) {
    console.error('FAIL:', err);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('FAIL (unhandled):', err);
  process.exit(1);
});
