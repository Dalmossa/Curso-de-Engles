/**
 * RLS cross-learner isolation (P2.1)
 *
 * P2.1.a — Integration tests for cross-learner RLS behavior on real PostgreSQL.
 * - Skips if DATABASE_URL (or TEST_DATABASE_URL) is not set (cannot run on PGlite-only).
 * - Connects to real PostgreSQL and replays the migration schema.
 * - Seeds minimal learner-scoped rows, sets context via SET LOCAL/session context (PgSessionContext),
 *   verifies A cannot see B's data and cannot UPDATE/DELETE B's rows.
 * - Tests worker bypass and admin bypass cases.
 */

import { DataSource } from 'typeorm';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import {
  PgSessionContext,
  LearnerContextError,
} from '../../src/infrastructure/persistence/pg-session-context.js';

const LEARNER_A = 'aaaaaaaa-aaaa-4111-8111-111111111111';
const LEARNER_B = 'bbbbbbbb-bbbb-4222-8222-222222222222';

describe('RLS cross-learner isolation (P2.1)', () => {
  let ctx: TestDbContext;
  let dataSource: DataSource;
  let sessionContext: PgSessionContext;

  // Skip if no real database URL is configured
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
      // Clean learner-scoped tables between tests
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

      // Seed learners
      await dataSource.query(
        `INSERT INTO learners (id) VALUES ($1), ($2) ON CONFLICT DO NOTHING`,
        [LEARNER_A, LEARNER_B],
      );

      // Seed minimal reference data required by FKs
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
         VALUES ('v1','[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',0.8,0.9,0,false) ON CONFLICT DO NOTHING`,
      );
      await dataSource.query(
        `INSERT INTO items (id, skill_ids, cefr_level, domain_id, item_type, modality, p_random, stem, provenance_kind, lifecycle_state, br_pt_form_state)
         VALUES ('it_test_1','{grammar.be}','A1','grammar','gap_fill','text',0.25,'stem','authored','authored','applicable') ON CONFLICT DO NOTHING`,
      );
    });

    it('counts RLS tables and policies as expected', async () => {
      const rlsTables = await dataSource.query(
        `SELECT count(*)::int AS n FROM pg_class c
         JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE n.nspname='public' AND c.relkind='r' AND c.relrowsecurity`,
      );
      expect(rlsTables[0].n).toBe(15);

      const policies = await dataSource.query(
        "SELECT count(*)::int AS n FROM pg_policies WHERE schemaname='public'",
      );
      expect(policies[0].n).toBe(45);
    });

    it('learner A cannot see learner B rows under app role', async () => {
      // Seed data as owner (or ensure structure) then test under app role
      await dataSource.query(`INSERT INTO sessions (learner_id) VALUES ($1)`, [LEARNER_B]);
      await dataSource.query(`INSERT INTO sessions (learner_id) VALUES ($1)`, [LEARNER_A]);

      await dataSource.query('SET ROLE its_platform_app');
      try {
        const result = await sessionContext.withLearner(LEARNER_A, async (tx) => {
          const rows = await tx.query('SELECT learner_id FROM sessions ORDER BY learner_id');
          return rows;
        });
        // Should only see A's rows
        expect(result.length).toBe(1);
        expect(result[0].learner_id).toBe(LEARNER_A);
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('cross-learner SELECT returns 0 rows for non-owned data', async () => {
      await dataSource.query(`INSERT INTO practice_attempts (session_id, learner_id, pack_layer, total_items, correct_count)
        SELECT s.id, s.learner_id, 'L1', 1, 1
        FROM sessions s JOIN learners l ON l.id = s.learner_id
        WHERE s.learner_id = $1
        LIMIT 1`, [LEARNER_B]);
      // Create a session for A too
      await dataSource.query(`INSERT INTO sessions (learner_id) VALUES ($1)`, [LEARNER_A]);

      await dataSource.query('SET ROLE its_platform_app');
      try {
        await sessionContext.withLearner(LEARNER_A, async (tx) => {
          const bAttempts = await tx.query(
            'SELECT count(*)::int AS n FROM practice_attempts WHERE learner_id = $1',
            [LEARNER_B],
          );
          expect(bAttempts[0].n).toBe(0);
        });
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('cross-learner UPDATE affects 0 rows (RLS blocks)', async () => {
      // Seed B's fsrs state
      await dataSource.query(
        `INSERT INTO fsrs_states (learner_id, item_id, stability, difficulty, state, last_review, due_date, w_version)
         VALUES ($1, 'it_test_1', 1.0, 5.0, 'new', now(), current_date, 'v1')`,
        [LEARNER_B],
      );

      await dataSource.query('SET ROLE its_platform_app');
      try {
        await sessionContext.withLearner(LEARNER_A, async (tx) => {
          const res = await tx.query(
            'UPDATE fsrs_states SET difficulty = 6.0 WHERE learner_id = $1',
            [LEARNER_B],
          );
          // RLS WITH CHECK/USING means no rows match for A's context
          expect(res.rowCount).toBe(0);
        });
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('cross-learner DELETE affects 0 rows (RLS blocks)', async () => {
      await dataSource.query(`INSERT INTO sessions (learner_id) VALUES ($1)`, [LEARNER_B]);

      await dataSource.query('SET ROLE its_platform_app');
      try {
        await sessionContext.withLearner(LEARNER_A, async (tx) => {
          const res = await tx.query('DELETE FROM sessions WHERE learner_id = $1', [LEARNER_B]);
          expect(res.rowCount).toBe(0);
        });
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('worker bypass allows access to any learner data', async () => {
      await dataSource.query(`INSERT INTO sessions (learner_id) VALUES ($1)`, [LEARNER_B]);

      await dataSource.query('SET ROLE its_platform_worker');
      try {
        const res = await dataSource.query(
          'SELECT count(*)::int AS n FROM sessions WHERE learner_id = $1',
          [LEARNER_B],
        );
        expect(res.rows[0].n).toBe(1);
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('admin bypass allows access to any learner data', async () => {
      await dataSource.query(`INSERT INTO theta_estimates (learner_id, skill_id, theta, se, ci95_lower, ci95_upper, evidence_count)
       VALUES ($1, 'grammar.be', 0.1, 0.3, -0.5, 0.7, 5)`, [LEARNER_B]);

      await dataSource.query('SET ROLE its_platform_admin');
      try {
        const res = await dataSource.query(
          'SELECT count(*)::int AS n FROM theta_estimates WHERE learner_id = $1',
          [LEARNER_B],
        );
        expect(res.rows[0].n).toBe(1);
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });

    it('blank learner id is rejected by context', async () => {
      await dataSource.query('SET ROLE its_platform_app');
      try {
        await expect(sessionContext.withLearner('   ', async () => undefined)).rejects.toBeInstanceOf(
          LearnerContextError,
        );
      } finally {
        await dataSource.query('RESET ROLE');
      }
    });
  });
});
