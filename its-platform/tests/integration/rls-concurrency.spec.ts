/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pool, type Client } from 'pg';
import { createTestDb, type TestDbContext } from '../helpers/test-db.js';

const hasDbUrl = !!(process.env['TEST_DATABASE_URL'] || process.env['DATABASE_URL']);

const maybeDescribe = hasDbUrl ? describe : describe.skip;

maybeDescribe('RLS concurrency (P2.1.b)', () => {
  let pool: Pool;
  let context: TestDbContext;

  const cleanupTables = async (client: Client) => {
    await client.query(
      `TRUNCATE TABLE
         consent_records,
         affective_signals,
         error_log,
         diagnostic_responses,
         diagnostic_results,
         slot_responses,
         listening_attempts,
         item_responses,
         practice_attempts,
         fsrs_states,
         theta_estimates,
         learner_mastery,
         sessions,
         learners
       RESTART IDENTITY CASCADE`,
    );
  };

  const setLearner = async (client: Client, learnerId: string) => {
    await client.query(`SET LOCAL app.current_learner_id = $1`, [learnerId]);
  };

  const setRoleApp = async (client: Client) => {
    await client.query('SET SESSION ROLE its_platform_app');
  };

  const unsetRole = async (client: Client) => {
    await client.query('RESET ROLE');
  };

  const countRlsTables = async (client: Client): Promise<number> => {
    const r = await client.query<{ n: number }>(
      `SELECT count(*)::int AS n
         FROM pg_class c
         JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'
          AND c.relrowsecurity = true`,
    );
    return r.rows[0]?.n ?? 0;
  };

  const countPolicies = async (client: Client): Promise<number> => {
    const r = await client.query<{ n: number }>(
      `SELECT count(*)::int AS n
         FROM pg_policy p
         JOIN pg_class c ON c.oid = p.polrelid
         JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'`,
    );
    return r.rows[0]?.n ?? 0;
  };

  const seedLearners = async (client: Client) => {
    await client.query(
      `INSERT INTO learners (id, created_at, cefr_level)
       VALUES
         ('550e8400-e29b-41d4-a716-446655440001', now(), 'A1'),
         ('550e8400-e29b-41d4-a716-446655440002', now(), 'A1'),
         ('550e8400-e29b-41d4-a716-446655440003', now(), 'A2')`,
    );
  };

  const seedMinimal = async (client: Client) => {
    await cleanupTables(client);
    await seedLearners(client);
    // seed a tiny mastery row per learner for UPDATE/SELECT tests
    await client.query(
      `INSERT INTO learner_mastery (learner_id, skill_id, mastery, last_updated)
       VALUES
         ('550e8400-e29b-41d4-a716-446655440001','s_grammar_basic', 0.5, now()),
         ('550e8400-e29b-41d4-a716-446655440002','s_grammar_basic', 0.4, now())`,
    );
  };

  beforeAll(async () => {
    context = await createTestDb();
    const dbUrl = process.env['TEST_DATABASE_URL'] || process.env['DATABASE_URL'];
    pool = new Pool({ connectionString: dbUrl });
  });

  afterAll(async () => {
    await pool.end();
    await context.cleanup();
  });

  it('has expected RLS surface (15 tables, 45 policies)', async () => {
    const c = await pool.connect();
    try {
      await setRoleApp(c);
      expect(await countRlsTables(c)).toBe(15);
      expect(await countPolicies(c)).toBe(45);
    } finally {
      await unsetRole(c);
      c.release();
    }
  });

  it('concurrent SELECTs return only own rows (no leakage)', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }

    const a = await pool.connect();
    const b = await pool.connect();
    try {
      await Promise.all([setRoleApp(a), setRoleApp(b)]);
      await Promise.all([
        setLearner(a, '550e8400-e29b-41d4-a716-446655440001'),
        setLearner(b, '550e8400-e29b-41d4-a716-446655440002'),
      ]);
      const [ra, rb] = await Promise.all([
        a.query<{ learner_id: string }>(
          `SELECT learner_id FROM learner_mastery ORDER BY learner_id`,
        ),
        b.query<{ learner_id: string }>(
          `SELECT learner_id FROM learner_mastery ORDER BY learner_id`,
        ),
      ]);
      const idsA = ra.rows.map((r) => r.learner_id);
      const idsB = rb.rows.map((r) => r.learner_id);
      expect(idsA).toEqual(['550e8400-e29b-41d4-a716-446655440001']);
      expect(idsB).toEqual(['550e8400-e29b-41d4-a716-446655440002']);
    } finally {
      await Promise.all([unsetRole(a), unsetRole(b)]);
      a.release();
      b.release();
    }
  });

  it('concurrent cross-owner UPDATEs affect 0 rows each', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }
    const a = await pool.connect();
    const b = await pool.connect();
    try {
      await Promise.all([setRoleApp(a), setRoleApp(b)]);
      await Promise.all([
        setLearner(a, '550e8400-e29b-41d4-a716-446655440001'),
        setLearner(b, '550e8400-e29b-41d4-a716-446655440002'),
      ]);
      const [ua, ub] = await Promise.all([
        a.query(
          `UPDATE learner_mastery
              SET mastery = 0.9
            WHERE learner_id = '550e8400-e29b-41d4-a716-446655440002'`,
        ),
        b.query(
          `UPDATE learner_mastery
              SET mastery = 0.9
            WHERE learner_id = '550e8400-e29b-41d4-a716-446655440001'`,
        ),
      ]);
      expect(ua.rowCount).toBe(0);
      expect(ub.rowCount).toBe(0);
      const after = await c.query<{ learner_id: string; mastery: string }>(
        `SELECT learner_id, mastery::text FROM learner_mastery ORDER BY learner_id`,
      );
      expect(after.rows).toEqual([
        { learner_id: '550e8400-e29b-41d4-a716-446655440001', mastery: '0.5' },
        { learner_id: '550e8400-e29b-41d4-a716-446655440002', mastery: '0.4' },
      ]);
    } finally {
      await Promise.all([unsetRole(a), unsetRole(b)]);
      a.release();
      b.release();
    }
  });

  it('concurrent cross-owner DELETEs affect 0 rows each', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }
    const a = await pool.connect();
    const b = await pool.connect();
    try {
      await Promise.all([setRoleApp(a), setRoleApp(b)]);
      await Promise.all([
        setLearner(a, '550e8400-e29b-41d4-a716-446655440001'),
        setLearner(b, '550e8400-e29b-41d4-a716-446655440002'),
      ]);
      const [da, db] = await Promise.all([
        a.query(
          `DELETE FROM learner_mastery WHERE learner_id = '550e8400-e29b-41d4-a716-446655440002'`,
        ),
        b.query(
          `DELETE FROM learner_mastery WHERE learner_id = '550e8400-e29b-41d4-a716-446655440001'`,
        ),
      ]);
      expect(da.rowCount).toBe(0);
      expect(db.rowCount).toBe(0);
      const cnt = await c.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM learner_mastery`,
      );
      expect(cnt.rows[0]?.n).toBe(2);
    } finally {
      await Promise.all([unsetRole(a), unsetRole(b)]);
      a.release();
      b.release();
    }
  });

  it('reader–writer: A reads, B cannot modify A’s row (concurrent)', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }
    const a = await pool.connect();
    const b = await pool.connect();
    try {
      await Promise.all([setRoleApp(a), setRoleApp(b)]);
      await Promise.all([
        setLearner(a, '550e8400-e29b-41d4-a716-446655440001'),
        setLearner(b, '550e8400-e29b-41d4-a716-446655440002'),
      ]);
      const [ra] = await Promise.all([
        a.query(
          `SELECT learner_id, mastery::text FROM learner_mastery WHERE learner_id='550e8400-e29b-41d4-a716-446655440001'`,
        ),
        (async () => {
          const res = await b.query(
            `UPDATE learner_mastery SET mastery=1.0 WHERE learner_id='550e8400-e29b-41d4-a716-446655440001'`,
          );
          return res;
        })(),
      ]);
      expect(ra.rowCount).toBe(1);
      const after = await c.query<{ mastery: string }>(
        `SELECT mastery::text FROM learner_mastery WHERE learner_id='550e8400-e29b-41d4-a716-446655440001'`,
      );
      expect(after.rows[0]?.mastery).toBe('0.5');
    } finally {
      await Promise.all([unsetRole(a), unsetRole(b)]);
      a.release();
      b.release();
    }
  });

  it('SET LOCAL isolation across separate connections', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }
    const a = await pool.connect();
    const b = await pool.connect();
    try {
      await Promise.all([setRoleApp(a), setRoleApp(b)]);
      await setLearner(a, '550e8400-e29b-41d4-a716-446655440001');
      await setLearner(b, '550e8400-e29b-41d4-a716-446655440002');
      const [ra1, rb1] = await Promise.all([
        a.query<{ n: number }>(
          `SELECT count(*)::int AS n FROM learner_mastery`,
        ),
        b.query<{ n: number }>(
          `SELECT count(*)::int AS n FROM learner_mastery`,
        ),
      ]);
      expect(ra1.rows[0]?.n).toBe(1);
      expect(rb1.rows[0]?.n).toBe(1);
      await setLearner(a, '550e8400-e29b-41d4-a716-446655440003');
      const [ra2] = await Promise.all([
        a.query<{ n: number }>(
          `SELECT count(*)::int AS n FROM learner_mastery`,
        ),
        b.query<{ n: number }>(
          `SELECT count(*)::int AS n FROM learner_mastery`,
        ),
      ]);
      expect(ra2.rows[0]?.n).toBe(0);
    } finally {
      await Promise.all([unsetRole(a), unsetRole(b)]);
      a.release();
      b.release();
    }
  });

  it('worker bypass sees any learner data', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }
    const w = await pool.connect();
    try {
      await setRoleApp(w);
      await w.query(`SET LOCAL app.worker = 'true'`);
      const r = await w.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM learner_mastery`,
      );
      expect(r.rows[0]?.n).toBe(2);
    } finally {
      await unsetRole(w);
      w.release();
    }
  });

  it('admin bypass sees any learner data', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }
    const adm = await pool.connect();
    try {
      await setRoleApp(adm);
      await adm.query(`SET LOCAL app.bypass_rls = 'true'`);
      const r = await adm.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM learner_mastery`,
      );
      expect(r.rows[0]?.n).toBe(2);
    } finally {
      await unsetRole(adm);
      adm.release();
    }
  });

  it('blank learner_id is rejected by RLS guard', async () => {
    const c = await pool.connect();
    try {
      await seedMinimal(c);
    } finally {
      c.release();
    }
    const cl = await pool.connect();
    try {
      await setRoleApp(cl);
      await cl.query(`SET LOCAL app.current_learner_id = ''`);
      const r = await cl.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM learner_mastery`,
      );
      expect(r.rows[0]?.n).toBe(0);
    } finally {
      await unsetRole(cl);
      cl.release();
    }
  });
});
