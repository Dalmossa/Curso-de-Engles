/**
 * P2.2 — `append_only_events` append path and chain verification against **real PostgreSQL 16**
 * (ADR-014: the hash chain's trigger, its advisory lock and the role grants are only really
 * exercised on a real server).
 *
 * Skipped unless `TEST_DATABASE_URL` or `DATABASE_URL` is set, the way `rls-isolation.spec.ts`
 * is — a PGlite run would assert the same trigger logic but not the role model the UPDATE refusal
 * depends on.
 *
 * What this spec proves that no unit test can:
 *
 *   1. `AuditService.append` writes through the trigger; three appends produce a **contiguous**
 *      chain the repository's reader reconciles (`AuditChainVerifier` → `{ok: true, length: 3}`).
 *      This is also the proof that the TS serialization in `audit-chain-verifier.ts` is the
 *      migration's, byte for byte: the hashes were computed by `fn_append_only_hash_chain()` and
 *      the verifier recomputes them.
 *   2. Consecutive appends link: row N+1's `prev_hash` equals row N's `row_hash` as raw `bytea`,
 *      not merely as equal-looking hex.
 *   3. `UPDATE append_only_events` is refused for `its_platform_app` — the `REVOKE` is the
 *      primary control (X-3), and the `BEFORE UPDATE` guard is the backstop for a role that
 *      somehow did hold the grant (asserted separately as the owner).
 *   4. The read context matters: a `learner_id IS NULL` system row is invisible to
 *      `its_platform_app` under a learner GUC but visible to `its_platform_worker` — the reason
 *      `readChain()` must run as a bypass/worker context.
 */

import { DataSource } from 'typeorm';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import { AuditRepository } from '../../src/infrastructure/repositories/audit.repository.js';
import { AuditService } from '../../src/modules/audit/audit.service.js';
import { PgSessionContext } from '../../src/infrastructure/persistence/pg-session-context.js';
import { AuditChainVerifier } from '../../src/domain/services/audit-chain-verifier.js';

const LEARNER = 'aaaaaaaa-aaaa-4111-8111-111111111111';

describe('append-only audit log (P2.2)', () => {
  let ctx: TestDbContext;
  let dataSource: DataSource;
  let repository: AuditRepository;
  let service: AuditService;

  const hasDbUrl = Boolean(process.env['DATABASE_URL'] || process.env['TEST_DATABASE_URL']);
  const maybeDescribe = hasDbUrl ? describe : describe.skip;

  maybeDescribe('on real PostgreSQL', () => {
    beforeAll(async () => {
      ctx = await createTestDb();
      dataSource = ctx.dataSource;
      repository = new AuditRepository(dataSource);
      service = new AuditService(repository, new PgSessionContext(dataSource));
    });

    afterAll(async () => {
      await ctx.cleanup();
    });

    beforeEach(async () => {
      await dataSource.query('TRUNCATE TABLE append_only_events RESTART IDENTITY CASCADE');
      await dataSource.query('TRUNCATE TABLE learners RESTART IDENTITY CASCADE');
      await dataSource.query('INSERT INTO learners (id) VALUES ($1) ON CONFLICT DO NOTHING', [
        LEARNER,
      ]);
    });

    async function appendThree(): Promise<void> {
      await service.append({
        eventType: 'session_start',
        learnerId: LEARNER,
        payload: { n: 1, modality: 'text' },
      });
      await service.append({
        eventType: 'item_response',
        learnerId: LEARNER,
        itemId: 'it_grammar_be_001',
        skillIds: ['grammar.be'],
        payload: { n: 2, correct: true },
      });
      await service.append({
        eventType: 'session_end',
        learnerId: LEARNER,
        payload: { n: 3, duration_ms: 1200 },
      });
    }

    it('appends three events that form a chain the verifier accepts', async () => {
      await appendThree();

      const rows = await repository.readChain();
      expect(rows.length).toBe(3);
      expect(rows[0]!.prevHash).toBeNull();

      await expect(new AuditChainVerifier(repository).verify()).resolves.toEqual({
        ok: true,
        length: 3,
      });
    });

    it('keeps seq a string and links consecutive appends byte-for-byte', async () => {
      const first = await service.append({
        eventType: 'session_start',
        learnerId: LEARNER,
        payload: { n: 1 },
      });
      const second = await service.append({
        eventType: 'session_end',
        learnerId: LEARNER,
        payload: { n: 2 },
      });

      // BIGINT is not a JS number; the driver must have handed back a string.
      expect(typeof first.seq).toBe('string');
      expect(BigInt(second.seq)).toBe(BigInt(first.seq) + 1n);

      const raw = (await dataSource.query(
        'SELECT seq::text AS seq, prev_hash, row_hash FROM append_only_events ORDER BY seq',
      )) as Array<{ seq: string; prev_hash: Buffer | null; row_hash: Buffer }>;

      expect(raw).toHaveLength(2);
      expect(raw[0]!.prev_hash).toBeNull();
      // Byte-for-byte: row 2's prev_hash is row 1's row_hash.
      expect(Buffer.compare(raw[1]!.prev_hash!, raw[0]!.row_hash)).toBe(0);
    });

    it('refuses UPDATE as its_platform_app (X-3 grant), and the guard refuses it even as owner', async () => {
      await appendThree();

      // Primary control: `REVOKE UPDATE, DELETE … FROM its_platform_app`.
      const runner = dataSource.createQueryRunner();
      await runner.connect();
      try {
        await runner.query('SET ROLE its_platform_app');
        let appMessage: string | null = null;
        try {
          await runner.query("UPDATE append_only_events SET payload = '{}'::jsonb");
        } catch (error) {
          appMessage = (error as Error).message;
        }
        expect(appMessage).not.toBeNull();
        expect(appMessage).toMatch(/permission denied|immutable/);
      } finally {
        await runner.query('RESET ROLE').catch(() => undefined);
        await runner.release();
      }

      // Backstop: the BEFORE UPDATE guard raises even for a role that holds the grant (owner).
      await expect(
        dataSource.query("UPDATE append_only_events SET payload = '{}'::jsonb"),
      ).rejects.toThrow(/immutable/);
    });

    it('hides learner_id IS NULL audit rows from the app role but shows them to the worker', async () => {
      await appendThree();
      // A system/audit row is one whose learner_id is NULL (auth/consent/erasure belong to
      // P1.15–P1.17 and M6; this test emits one to establish the read-context rule).
      await service.append({ eventType: 'auth_failure', payload: { reason: 'bad_credentials' } });

      const appRunner = dataSource.createQueryRunner();
      await appRunner.connect();
      try {
        await appRunner.query('SET ROLE its_platform_app');
        await appRunner.startTransaction();
        await appRunner.query("SELECT set_config('app.current_learner_id', $1, true)", [LEARNER]);
        const appCount = (await appRunner.query(
          'SELECT count(*)::int AS n FROM append_only_events',
        )) as Array<{ n: number }>;
        expect(appCount[0]!.n).toBe(3);
        await appRunner.rollbackTransaction();
      } finally {
        await appRunner.query('RESET ROLE').catch(() => undefined);
        await appRunner.release();
      }

      const workerRunner = dataSource.createQueryRunner();
      await workerRunner.connect();
      try {
        await workerRunner.query('SET ROLE its_platform_worker');
        const workerCount = (await workerRunner.query(
          'SELECT count(*)::int AS n FROM append_only_events',
        )) as Array<{ n: number }>;
        expect(workerCount[0]!.n).toBe(4);
      } finally {
        await workerRunner.query('RESET ROLE').catch(() => undefined);
        await workerRunner.release();
      }
    });
  });
});
