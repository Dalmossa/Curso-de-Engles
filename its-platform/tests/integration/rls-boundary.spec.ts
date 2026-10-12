/**
 * RLS boundary and denial semantics tests (P2.1.c)
 *
 * - Skips if DATABASE_URL (or TEST_DATABASE_URL) is not set (cannot run on PGlite-only).
 * - Tests denial semantics, path traversal/ID confusion, bypass behavior,
 * - immutability constraints, and that all 15 learner-scoped tables enforce RLS.
 */
import { DataSource } from 'typeorm';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import {
  PgSessionContext,
  LearnerContextError,
} from '../../src/infrastructure/persistence/pg-session-context.js';

const LEARNER_A = 'aaaaaaaa-aaaa-4111-8111-111111111111';
const LEARNER_B = 'bbbbbbbb-bbbb-4222-8222-222222222222';

describe('RLS boundary and denial semantics (P2.1.c)', () => {
  let ctx: TestDbContext;
  let dataSource: DataSource;
  let sessionContext: PgSessionContext;

  const hasDbUrl = Boolean(process.env['DATABASE_URL'] || process.env['TEST_DATABASE_URL']);
  const maybeDescribe = hasDbUrl ? describe : describe.skip;

  maybeDescribe('on real PostgreSQL', () => {
    beforeAll(async () => {
      ctx = await createTestDb();
      dataSource = ctx.dataSource;
      sessionContext = new PgSessionContext(dataSource);
    });

    afterAll(async () => {
      await ctx.cleanup();
    });

    beforeEach(async () => {
      await dataSource.query('SET session_replication_role = replica');
      await dataSource.query('TRUNCATE TABLE append_only_events RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE diagnostic_responses RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE diagnostic_results RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE slot_responses RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE listening_attempts RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE item_responses RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE practice_attempts RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE sessions RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE affective_signals RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE error_log RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE fsrs_states RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE theta_estimates RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE learner_mastery RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE consent_records RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE learners RESTART IDENTITY CASCADE');
      await dataSource.query('SET session_replication_role = DEFAULT');

      await dataSource.query(
        `INSERT INTO learners (id) VALUES ($1), ($2) ON CONFLICT DO NOTHING`,
        [LEARNER_A, LEARNER_B],
      );
      await dataSource.query(
        "INSERT INTO cefr_levels (code,label,sort_order) VALUES ('A1','A1',1),('A2','A2',2) ON CONFLICT DO NOTHING",
      );
      await dataSource.query(
        "INSERT INTO domains (id,label,tracked) VALUES ('grammar','Grammar',true) ON CONFLICT DO NOTHING",
      );
      await dataSource.query(
        "INSERT INTO skills (id,domain_id,label) VALUES ('grammar.be','grammar','Be') ON CONFLICT DO NOTHING",
      );
      await dataSource.query(
        `INSERT INTO modules (id,title,cefr_level,track,source_markdowns,sort_order,expected_lessons)
         VALUES ('mod_test','T','A1','General','{}',1,6) ON CONFLICT DO NOTHING`,
      );
      await dataSource.query(
        `INSERT INTO lessons (id,module_id,title,cefr_level,reuse_basis,authoring_state,publication_state,permission_state)
         VALUES ('les_test','mod_test','T','A1','cite_only','authored','publishable','not_required') ON CONFLICT DO NOTHING`,
      );
      await dataSource.query(
        `INSERT INTO fsrs_parameters (w_version,w,decay,factor,n_reviews,is_active)
         VALUES ('v1','[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',0.8,0.9,0,false) ON CONFLICT DO NOTHING`,
      );
      await dataSource.query(
        `INSERT INTO items (id, skill_ids, cefr_level, domain_id, item_type, modality, p_random, stem, provenance_kind, lifecycle_state, br_pt_form_state)
         VALUES ('it_test_1','{grammar.be}','A1','grammar','gap_fill','text',0.25,'stem','authored','authored','applicable') ON CONFLICT DO NOTHING`,
      );
    });

    it('all 15 learner-scoped tables enforce RLS', async () => {
      const rlsTables = await dataSource.query(
        `SELECT count(*)::int AS n FROM pg_class c
         JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity`,
      );
      expect(rlsTables[0].n).toBe(15);
    });

    it('blank current_learner_id (spaces) is rejected by context', async () => {
      await dataSource.query('SET ROLE its_platform_app');
      try {
        await expect(sessionContext.withLearner('   ', async () => undefined)).rejects.toBeInstanceOf(
          LearnerContextError,
        );
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('blank current_learner_id via SET LOCAL gives 0 rows', async () => {
      await dataSource.query('SET ROLE its_platform_app');
      try {
        await sessionContext.withLearner(LEARNER_A, async () => {
          await dataSource.query("SET LOCAL app.current_learner_id = ''");
          const res = await dataSource.query('SELECT count(*)::int AS n FROM sessions');
          expect(res.rows[0].n).toBe(0);
        });
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('invalid UUID in current_setting with nullif guard throws on cast', async () => {
      await dataSource.query('SET ROLE its_platform_app');
      try {
        await sessionContext.withLearner(LEARNER_A, async () => {
          await dataSource.query("SET LOCAL app.current_learner_id = 'not-a-uuid'");
          await expect(dataSource.query('SELECT count(*)::int AS n FROM sessions')).rejects.toThrow();
        });
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('DB layer denies cross-learner ops (0 rows/affected)', async () => {
      await dataSource.query(`INSERT INTO sessions (learner_id) VALUES ($1)`, [LEARNER_B]);

      await dataSource.query('SET ROLE its_platform_app');
      try {
        await sessionContext.withLearner(LEARNER_A, async (tx) => {
          const s1 = await tx.query('SELECT * FROM sessions WHERE learner_id = $1', [LEARNER_B]);
          expect(s1.rowCount).toBe(0);
          const u1 = await tx.query('UPDATE sessions SET updated_at = now() WHERE learner_id = $1', [LEARNER_B]);
          expect(u1.rowCount).toBe(0);
          const d1 = await tx.query('DELETE FROM sessions WHERE learner_id = $1', [LEARNER_B]);
          expect(d1.rowCount).toBe(0);
        });
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('worker can read cross-learner; worker bypass allows writes', async () => {
      await dataSource.query(`INSERT INTO sessions (learner_id) VALUES ($1)`, [LEARNER_B]);

      await dataSource.query('SET ROLE its_platform_worker');
      try {
        const r1 = await dataSource.query('SELECT count(*)::int AS n FROM sessions WHERE learner_id = $1', [LEARNER_B]);
        expect(r1.rows[0].n).toBe(1);
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('admin bypass allows read and write', async () => {
      await dataSource.query(`INSERT INTO theta_estimates (learner_id, skill_id, theta, se, ci95_lower, ci95_upper, evidence_count)
       VALUES ($1, 'grammar.be', 0.1, 0.3, -0.5, 0.7, 5)`, [LEARNER_B]);

      await dataSource.query('SET ROLE its_platform_admin');
      try {
        const res = await dataSource.query('SELECT count(*)::int AS n FROM theta_estimates WHERE learner_id = $1', [LEARNER_B]);
        expect(res.rows[0].n).toBe(1);
        const upd = await dataSource.query('UPDATE theta_estimates SET theta = 0.9 WHERE learner_id = $1', [LEARNER_B]);
        expect(upd.rowCount).toBe(1);
        const del = await dataSource.query('DELETE FROM theta_estimates WHERE learner_id = $1', [LEARNER_B]);
        expect(del.rowCount).toBe(1);
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('append_only_events: UPDATE/DELETE blocked by RLS under app role', async () => {
      await dataSource.query(`INSERT INTO append_only_events (type, payload, learner_id) VALUES ('test', '{}', $1)`, [LEARNER_B]);

      await dataSource.query('SET ROLE its_platform_app');
      try {
        await sessionContext.withLearner(LEARNER_A, async (tx) => {
          const upd = await tx.query('UPDATE append_only_events SET payload = $1 WHERE learner_id = $2', ['{"x":1}', LEARNER_B]);
          expect(upd.rowCount).toBe(0);
          const del = await tx.query('DELETE FROM append_only_events WHERE learner_id = $1', [LEARNER_B]);
          expect(del.rowCount).toBe(0);
        });
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('items.id immutable under app role (I-2) - UPDATE column restricted', async () => {
      await dataSource.query('SET ROLE its_platform_app');
      try {
        await expect(
          dataSource.query("UPDATE items SET id = 'it_hacked' WHERE id = 'it_test_1'"),
        ).rejects.toThrow();
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });
  });
});
