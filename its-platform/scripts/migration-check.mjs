#!/usr/bin/env node
/**
 * P0.4 gate — create-schema migration, verified on PGlite (default) and on real
 * PostgreSQL 16 (when DATABASE_URL is set). Kept as plain ESM like the other gates.
 *
 * The migration DDL lives once, in src/migrations/1791331200000-create-schema.ts
 * (SCHEMA_STATEMENTS). The migration class and this script consume the same array —
 * a drift between the two is impossible by construction.
 *
 * Usage:
 *   node scripts/migration-check.mjs                 # PGlite (in-memory)
 *   DATABASE_URL=postgres://u:p@host:5432/db node scripts/migration-check.mjs
 *
 * Exit code 1 on any FAIL (ADR-014: RLS behaviour is only asserted on real Postgres).
 */

const MODE = process.env.DATABASE_URL ? 'postgres' : 'pglite';

let failures = 0;
let passes = 0;

const ok = (label, extra = '') => {
  passes += 1;
  console.log(`  ✓ ${label}${extra ? ` — ${extra}` : ''}`);
};
const fail = (label, err) => {
  failures += 1;
  console.error(`  ✗ ${label}: ${err?.message ?? err}`);
};

/** Runs each block's operations sequentially, collecting pass/fail. */
async function it(label, fn) {
  try {
    await fn();
    ok(label);
  } catch (e) {
    fail(label, e);
  }
}

const expectSqlError = (msg) => {
  if (!msg) throw new Error('expected a SQL error but none was raised');
  return msg;
};

async function main() {
  let db;

  if (MODE === 'postgres') {
    const pg = (await import('pg')).default;
    db = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await db.connect();
  } else {
    const { PGlite } = await import('@electric-sql/pglite');
    db = new PGlite();
  }

  // Unified query surface: q() returns rows, execSnip() executes multi-statement text.
  const q = async (sql, params = []) => {
    if (MODE === 'postgres') {
      const res = await db.query(sql, params);
      return res.rows;
    }
    const res = await db.query(sql, params);
    return res.rows;
  };
  const execRaw = async (sql) => {
    if (MODE === 'postgres') {
      await db.query(sql);
    } else {
      await db.exec(sql);
    }
  };

  console.log(`\n== create-schema migration @ ${MODE} ==\n`);

  // On real Postgres, start from a clean slate (re-runnable locally).
  if (MODE === 'postgres') {
    await execRaw('DROP SCHEMA public CASCADE');
    await execRaw('CREATE SCHEMA public');
  }

  // ---- 1. Replay the migration (single source of truth: SCHEMA_STATEMENTS) ----
  let migration;
  try {
    migration = await import('../dist/migrations/1791331200000-create-schema.js');
  } catch (e) {
    console.error('Could not import dist migration — did you run `npm run build` first?');
    console.error(e.message);
    process.exit(1);
  }

  const statements = migration.SCHEMA_STATEMENTS;
  if (!Array.isArray(statements) || statements.length < 50) {
    console.error(`SCHEMA_STATEMENTS malformed: expected >= 50 statements, got ${statements?.length}`);
    process.exit(1);
  }
  await it('migration replays cleanly', async () => {
    for (const stmt of statements) await execRaw(stmt);
  });

  // ---- 2. Structural asserts ----
  await it('33 tables exist (ERD §6)', async () => {
    const rows = await q(
      "SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema='public'",
    );
    if (rows[0].n !== 33) throw new Error(`expected 33 tables, got ${rows[0].n}`);
  });

  await it('4 named enum types exist (ADR-019)', async () => {
    const rows = await q(
      "SELECT typname FROM pg_type WHERE typname IN ('its_event_type','its_item_lifecycle_state','its_fsrs_review_state','its_pack_layer')",
    );
    if (rows.length !== 4) throw new Error(`expected 4 enum types, got ${rows.length}`);
  });

  await it('15 learner-scoped tables have RLS enabled (§9)', async () => {
    const rows = await q(
      `SELECT c.relname FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
       WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity`,
    );
    if (rows.length !== 15) throw new Error(`expected 15 RLS tables, got ${rows.length}`);
  });

  await it('45 policies exist (15 tables × learner_isolation/admin_bypass/worker_access)', async () => {
    const rows = await q(
      "SELECT count(*)::int AS n FROM pg_policies WHERE schemaname='public'",
    );
    if (rows[0].n !== 45) throw new Error(`expected 45 policies, got ${rows[0].n}`);
  });

  await it("every learner_isolation predicate uses nullif(current_setting(...), '') (ADR-026 §4)", async () => {
    // `qual`/`with_check` are the *deparsed* expressions, so match the function name
    // case-insensitively: PostgreSQL 17 (PGlite) rewrites it as `NULLIF(…)`.
    const usesNullif = /nullif\s*\(/i;
    const rows = await q(
      `SELECT tablename, qual, with_check FROM pg_policies
       WHERE schemaname='public' AND policyname='learner_isolation'`,
    );
    if (rows.length !== 15) {
      throw new Error(`expected 15 learner_isolation policies, got ${rows.length}`);
    }
    for (const row of rows) {
      if (!row.qual || !usesNullif.test(row.qual)) {
        throw new Error(
          `table ${row.tablename}: USING predicate lacks nullif( — got ${row.qual ?? 'NULL'}`,
        );
      }
      if (!row.with_check || !usesNullif.test(row.with_check)) {
        throw new Error(
          `table ${row.tablename}: WITH CHECK predicate lacks nullif( — got ${row.with_check ?? 'NULL'}`,
        );
      }
    }
  });

  await it('4 [db] triggers installed (I-3, D-5, G-8, hash chain)', async () => {
    const rows = await q(
      `SELECT tgname FROM pg_trigger
       WHERE NOT tgisinternal AND tgname IN
         ('trg_item_options_distinct','trg_dialogue_min_two_speakers',
          'trg_diagnostic_skill_theta_state','trg_append_only_hash_chain')`,
    );
    if (rows.length !== 4) throw new Error(`expected 4 triggers, got ${rows.length}`);
  });

  await it('27 named indexes exist (ERD §6.9: 25 CREATE INDEX + 2 UNIQUE)', async () => {
    const rows = await q(
      `SELECT count(*)::int AS n FROM pg_indexes
       WHERE schemaname='public' AND (indexname LIKE 'idx\\_%' OR indexname LIKE 'uq\\_%')`,
    );
    if (rows[0].n !== 27) throw new Error(`expected 27 named indexes, got ${rows[0].n}`);
  });

  // ---- 3. Fixtures (content tables the behavioural asserts need) ----
  await q("INSERT INTO cefr_levels (code,label,sort_order) VALUES ('A1','A1',1),('A2','A2',2)");
  await q("INSERT INTO domains (id,label,tracked) VALUES ('grammar','Grammar',true)");
  await q("INSERT INTO skills (id,domain_id,label) VALUES ('grammar.be','grammar','Be')");
  await q(
    "INSERT INTO modules (id,title,cefr_level,track,source_markdowns,sort_order,expected_lessons) VALUES ('mod_test','T','A1','General','{}',1,6)",
  );
  await q(
    "INSERT INTO lessons (id,module_id,title,cefr_level,reuse_basis,authoring_state,publication_state,permission_state) VALUES ('les_test','mod_test','T','A1','cite_only','authored','publishable','not_required')",
  );
  const learners = await q('INSERT INTO learners DEFAULT VALUES RETURNING id');
  const learnerA = learners[0].id;
  const learnerB = (await q('INSERT INTO learners DEFAULT VALUES RETURNING id'))[0].id;

  // ---- 4. Hash chain (CONSTITUTION §4.6) ----
  // NOTE: events are appended one-per-statement (the app's write pattern). A multi-row
  // INSERT would not see sibling rows inside the row trigger, so the chain is only
  // meaningful for sequential appends; pg_advisory_xact_lock serializes those.
  await it('append_only_events hash chain links prev_hash→row_hash', async () => {
    await q("INSERT INTO append_only_events (event_type, payload) VALUES ('session_start', '{\"n\":1}')");
    await q("INSERT INTO append_only_events (event_type, payload) VALUES ('session_end', '{\"n\":2}')");
    const rows = await q(
      "SELECT seq, encode(prev_hash,'hex') AS prev_hash, encode(row_hash,'hex') AS row_hash FROM append_only_events ORDER BY seq",
    );
    if (rows.length !== 2) throw new Error(`expected 2 events, got ${rows.length}`);
    if (rows[0].prev_hash !== null) throw new Error('first row prev_hash must be NULL');
    if (!rows[1].prev_hash) throw new Error('second row prev_hash must be set');
    if (rows[0].row_hash !== rows[1].prev_hash) {
      throw new Error('chain broken: row 2 prev_hash != row 1 row_hash');
    }
    if (!rows[1].row_hash) throw new Error('second row row_hash must be set');
  });

  // ---- 5. I-3 [db]: duplicate normalized option text rejected ----
  await it('I-3 [db]: duplicate option_text (bold-stripped) rejected', async () => {
    await q(
      `INSERT INTO items (id, skill_ids, cefr_level, domain_id, item_type, modality, p_random, stem, provenance_kind)
       VALUES ('it_test_1', '{grammar.be}', 'A1', 'grammar', 'gap_fill', 'text', 0.25, 'stem', 'authored')`,
    );
    await q(
      `INSERT INTO item_options (item_id, position, option_text, note)
       VALUES ('it_test_1', 1, '**Hello**', 'distractor note')`,
    );
    await expectSqlError(
      await q(
        `INSERT INTO item_options (item_id, position, option_text, note)
         VALUES ('it_test_1', 2, '**Hello**', 'distractor note')`,
      ).then(
        () => null,
        (e) => e.message,
      ),
    );
  });

  // ---- 6. D-5 [db]: deferred ≥2 distinct speakers per dialogue ----
  await it('D-5 [db]: single-speaker dialogue rejected at commit (deferred)', async () => {
    await q("INSERT INTO voices (id,label,accent,gender) VALUES ('v_a','A','US','M'),('v_b','B','US','F')");
    await q("INSERT INTO speakers (id,display_name) VALUES ('sp_a','A'),('sp_b','B')");
    // `transcript` is NOT NULL (ADR-027 §3b) — every writer supplies it.
    await q(
      "INSERT INTO dialogues (id,title,cefr_level,status,duration_seconds,transcript) VALUES ('dlg_test','T','A1','shipped',60,'> **A:** hello')",
    );

    // One speaker alone, committed → deferred D-5 must raise at commit.
    if (MODE === 'postgres') {
      let commitErr = null;
      await db.query('BEGIN');
      await db.query(
        "INSERT INTO dialogue_speakers (dialogue_id,speaker_id,voice_id) VALUES ('dlg_test','sp_a','v_a')",
      );
      try {
        await db.query('COMMIT');
      } catch (e) {
        commitErr = e.message;
      }
      try {
        await db.query('ROLLBACK');
      } catch {
        /* already rolled back */
      }
      expectSqlError(commitErr);

      // Both speakers in one transaction must pass.
      await db.query('BEGIN');
      await db.query(
        "INSERT INTO dialogue_speakers (dialogue_id,speaker_id,voice_id) VALUES ('dlg_test','sp_a','v_a'),('dlg_test','sp_b','v_b')",
      );
      await db.query('COMMIT');
    } else {
      const commitErr = await db
        .exec(
          "BEGIN; INSERT INTO dialogue_speakers (dialogue_id,speaker_id,voice_id) VALUES ('dlg_test','sp_a','v_a'); COMMIT;",
        )
        .then(
          () => null,
          (e) => e.message,
        );
      expectSqlError(commitErr);
      await db
        .exec(
          "INSERT INTO dialogue_speakers (dialogue_id,speaker_id,voice_id) VALUES ('dlg_test','sp_a','v_a'),('dlg_test','sp_b','v_b')",
        )
        .catch((e) => {
          throw e;
        });
    }
  });

  // ---- 7. G-8 [db]: skill_theta.state discriminator validated ----
  await it('G-8 [db]: invalid skill_theta.state rejected', async () => {
    const good = {
      grammar: { state: 'point_estimate', theta: 0.1, se: 0.32, cefr: 'A2' },
    };
    const bad = { grammar: { state: 'bogus', theta: 0.1 } };
    const cols =
      'learner_id, theta, se_statistical, se_parameter, se_effective, precision_label, ci95_lower, ci95_upper, cefr, start_cefr, start_node, stopping_rule, skill_theta';
    await q(
      `INSERT INTO diagnostic_results (${cols}) VALUES ($1, 0.1, 0.2, 0.2, 0.2, 'medium', -0.3, 0.5, 'A1', 'A1', 'les_test', 'SE<0.4', $2::jsonb)`,
      [learnerA, JSON.stringify(good)],
    );
    const err = await q(
      `INSERT INTO diagnostic_results (${cols}) VALUES ($1, 0.1, 0.2, 0.2, 0.2, 'medium', -0.3, 0.5, 'A1', 'A1', 'les_test', 'SE<0.4', $2::jsonb)`,
      [learnerA, JSON.stringify(bad)],
    ).then(
      () => null,
      (e) => e.message,
    );
    expectSqlError(err);
  });

  // ---- 8. RLS behaviour (REAL POSTGRES ONLY — ADR-014) ----
  if (MODE === 'postgres') {
    await it('RLS: learner A sees only A rows; B sees none (SET LOCAL isolation)', async () => {
      await db.query('INSERT INTO sessions (learner_id) VALUES ($1)', [learnerA]);
      await db.query('SET ROLE its_platform_app');
      try {
        await db.query('BEGIN');
        await db.query(`SET LOCAL app.current_learner_id = '${learnerA}'`);
        const a = await db.query('SELECT count(*)::int AS n FROM sessions');
        if (a.rows[0].n !== 1) throw new Error(`learner A saw ${a.rows[0].n} sessions, expected 1`);
        await db.query(`SET LOCAL app.current_learner_id = '${learnerB}'`);
        const b = await db.query('SELECT count(*)::int AS n FROM sessions');
        if (b.rows[0].n !== 0) throw new Error(`learner B saw ${b.rows[0].n} sessions, expected 0`);
        await db.query('COMMIT');
      } finally {
        await db.query('RESET ROLE');
      }
    });

    await it('RLS: app role cannot UPDATE/DELETE append_only_events (X-3)', async () => {
      await db.query('SET ROLE its_platform_app');
      try {
        await db.query('BEGIN');
        await db.query(`SET LOCAL app.current_learner_id = '${learnerA}'`);
        const err = await db
          .query('UPDATE append_only_events SET payload = payload WHERE seq = 1')
          .then(
            () => null,
            (e) => e.message,
          );
        await db.query('ROLLBACK');
        if (!err) throw new Error('expected permission denied on UPDATE append_only_events');
      } finally {
        await db.query('RESET ROLE');
      }
    });

    await it('RLS: app role cannot UPDATE items.id (I-2 column grant)', async () => {
      await db.query('SET ROLE its_platform_app');
      try {
        await db.query('BEGIN');
        await db.query(`SET LOCAL app.current_learner_id = '${learnerA}'`);
        const err = await db
          .query("UPDATE items SET id = 'it_test_2' WHERE id = 'it_test_1'")
          .then(
            () => null,
            (e) => e.message,
          );
        await db.query('ROLLBACK');
        if (!err) throw new Error('expected permission denied on UPDATE items.id');
      } finally {
        await db.query('RESET ROLE');
      }
    });
  }

  if (db.end) await db.end();

  console.log(`\n${MODE}: ${passes} passed, ${failures} failed`);
  if (failures > 0) process.exit(1);
  console.log('✓ migration-check green');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});