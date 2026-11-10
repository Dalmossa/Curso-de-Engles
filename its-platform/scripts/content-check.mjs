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
// included). Every "content-check PASS" recorded against P0.5/P0.8s was therefore
// vacuous. The harness below now supplies a callback-style connection and the
// loader call is raced against a hard timeout, so a hang fails instead of
// passing.
// ---------------------------------------------------------------------------
import { PGlite } from '@electric-sql/pglite';
import { SCHEMA_STATEMENTS } from '../src/migrations/1791331200000-create-schema.ts';
import { loadContent } from '../dist/infrastructure/content/content-loader.js';
import { DataSource } from 'typeorm';

const EXPECTED_SKIP_COUNT = 16;
// ADR-027 §5: the lesson bodies the loader materialises into `lessons.body`.
const EXPECTED_LESSON_COUNT = 122;
const EXPECTED_PHASE_COUNT = 4;
const EXPECTED_LEARNER_MODEL_COUNT = 121;
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

/**
 * ADR-027 §5: the loader materialises the lesson's four phases and its learner model
 * into `lessons.body`. Read them back from the database — not from the report — and
 * fail closed on: 122 lessons; every lesson's phases exactly `1,2,3,4`; exactly 121
 * lessons with a non-null learner model (the one without is
 * `lessons/a2/les_a2_it_internet_history.md`).
 */
async function assertLessonBodies(ds) {
  const rows = await ds.query('SELECT id, body FROM lessons ORDER BY id');
  const problems = [];

  if (rows.length !== EXPECTED_LESSON_COUNT) {
    problems.push(`expected ${EXPECTED_LESSON_COUNT} lessons, got ${rows.length}`);
  }

  let withLearnerModel = 0;
  for (const row of rows) {
    let body;
    try {
      body = typeof row.body === 'string' ? JSON.parse(row.body) : row.body;
    } catch (e) {
      problems.push(`lesson ${row.id} has an unparseable body: ${e.message}`);
      continue;
    }
    const phases = body && Array.isArray(body.phases) ? body.phases : [];
    const numbers = phases.map((p) => p && p.phase);
    if (numbers.length !== EXPECTED_PHASE_COUNT || numbers.join(',') !== '1,2,3,4') {
      problems.push(`lesson ${row.id} has phases [${numbers.join(',')}], expected 1,2,3,4`);
    }
    if (body && body.learner_model !== null && body.learner_model !== undefined) {
      withLearnerModel += 1;
    }
  }

  if (withLearnerModel !== EXPECTED_LEARNER_MODEL_COUNT) {
    problems.push(
      `expected ${EXPECTED_LEARNER_MODEL_COUNT} lessons with a learner model, got ${withLearnerModel}`,
    );
  }

  if (problems.length > 0) {
    console.error(`FAIL: lesson bodies failed ${problems.length} assertion(s):`);
    for (const p of problems.slice(0, 10)) console.error(`  - ${p}`);
    return 1;
  }
  return 0;
}

/**
 * ADR-027 §3a: the corpus marks an item's key with a check mark, in one of two columns. The
 * loader read only the first, so 11 shipped slots loaded with `items.key IS NULL` and no
 * option flagged `is_key` — unscorable, and outside every `verify-integrity.py` check (which
 * globs `packs/`). ADR-027 §3b: every dialogue carries the transcript the API serves.
 *
 * The key obligation is **conditional on there being a choice**, exactly as
 * `verify-integrity.py` [11d] states it ("every item *with a distractor table* declares a
 * `**Key:**`"): the 6 ASR-scored minimal-pair items carry no options and legitimately no key
 * (ADR-004: `key: Optional[str]  # None for production items`). So the invariant asserted is
 * two-sided — options ⇔ key, in both directions.
 */
async function assertSlotKeys(ds) {
  const problems = [];

  const wrong = await ds.query(
    `SELECT id, n_options, n_keys, item_key FROM (
       SELECT i.id AS id, i.key AS item_key, i.scoring AS scoring,
              count(o.item_id) AS n_options,
              count(*) FILTER (WHERE o.is_key) AS n_keys
         FROM items i LEFT JOIN item_options o ON o.item_id = i.id
        GROUP BY i.id, i.key, i.scoring
     ) t
     WHERE (n_options > 0 AND (item_key IS NULL OR n_keys <> 1))
        OR (n_options = 0 AND (item_key IS NOT NULL OR n_keys <> 0))
     ORDER BY id`,
  );
  for (const row of wrong) {
    problems.push(
      `${row.id} has ${row.n_options} option(s), key=${row.item_key === null ? 'null' : row.item_key}, ` +
        `${row.n_keys} flagged key option(s) — a choice must carry exactly one key, ` +
        `and an item with no options must carry none`,
    );
  }

  const noTranscript = await ds.query(
    `SELECT id FROM dialogues WHERE transcript IS NULL OR btrim(transcript) = '' ORDER BY id`,
  );
  for (const row of noTranscript) {
    problems.push(`dialogue ${row.id} has no transcript`);
  }

  if (problems.length > 0) {
    console.error(`FAIL: slot keys failed ${problems.length} assertion(s):`);
    for (const p of problems.slice(0, 10)) console.error(`  - ${p}`);
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
      const reportFailed = assertReport(report);
      const bodiesFailed = await assertLessonBodies(ds);
      const keysFailed = await assertSlotKeys(ds);
      if (reportFailed || bodiesFailed || keysFailed) process.exit(1);
      console.log('PASS');
      if (ds.isInitialized) await ds.destroy();
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
    const reportFailed = assertReport(report);
    const bodiesFailed = await assertLessonBodies(ds);
    const keysFailed = await assertSlotKeys(ds);
    if (reportFailed || bodiesFailed || keysFailed) process.exit(1);
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
    console.log('PASS');
    if (ds.isInitialized) await ds.destroy();
  } catch (err) {
    console.error('FAIL:', err);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('FAIL (unhandled):', err);
  process.exit(1);
});
