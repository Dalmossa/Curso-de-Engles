/**
 * P1.10 — Placement result persistence (integration).
 *
 * The unit under test is `DiagnosticResultRepository.persist`, fed a **real** `DiagnosticRun`
 * from `administerDiagnostic` (P1.9) over all 12 items of `diagnostic_form_v1` in form order.
 * Nothing here fabricates a run shape: the assertions read back what the executor produced and
 * check that the two DDL tables (ADR-019 migration 1791331200000) hold it.
 *
 * The `diagnostic_responses` FKs (`item_id → items`, `skill_id → skills`) and
 * `diagnostic_results` FKs (`start_node → lessons`, `cefr`/`start_cefr → cefr_levels`) are real,
 * so the test seeds a minimal catalogue derived from the run itself rather than hard-coding ids.
 * That is also the honest demonstration of ADR-024 Decision 9: the response rows are only
 * storable once the referenced `items`/`skills` exist.
 *
 * **The answers this file used to exclude are now cases.** ADR-025 replaced
 * `computeThetaEstimate`: the old estimator's Fisher-information term collapsed as θ grew, so an
 * all-correct run produced an intermediate `se_after` of ~2.2e6 and PostgreSQL rejected the row
 * against `NUMERIC(6,3)` — 2509 of the form's 4096 response patterns could not be persisted at
 * all. Under ADR-025 every pattern yields `|θ̂| ≤ 6` and `0 < se < 6`, so the all-correct and
 * all-wrong runs are asserted at the end of this file rather than described here. The two
 * ordinary profiles below remain (they keep exercising the mapping) and nothing about them is
 * now special.
 *
 * **Which role the tests run as.** The `describe` below connects as the **table owner** — `postgres`
 * on the PGlite harness — and PostgreSQL does not apply a table's policies to its owner unless
 * `FORCE ROW LEVEL SECURITY` is set, which neither diagnostic table sets. So none of the 12 tests
 * below is an RLS test, and a `persist()` that never sets `app.current_learner_id` passes every one
 * of them. ADR-026 measured exactly that and closed it: the second `describe` at the end of this
 * file takes `SET ROLE its_platform_app` and exercises ADR-003's policy through
 * `PgSessionContext`, the single writer of the GUC. It is the half these tests cannot see.
 */

import { DataSource } from 'typeorm';
import { createTestDb } from '../helpers/db.js';
import {
  DiagnosticResultRepository,
  DiagnosticPersistenceError,
  MAX_REMEDIATION_NODES,
  serializeDomainThetas,
} from '../../src/infrastructure/repositories/diagnostic-result.repository.js';
import {
  PgSessionContext,
  LearnerContextError,
} from '../../src/infrastructure/persistence/pg-session-context.js';
import { administerDiagnostic } from '../../src/domain/services/diagnostic-fixed-form.service.js';
import { createDiagnosticFormV1 } from '../../src/domain/services/pilot-bank.service.js';
import type { DiagnosticForm, DiagnosticRun } from '../../src/domain/entities/pilot-bank.js';

const LEARNER_ID = '11111111-1111-4111-8111-111111111111';
const SESSION_ID = '22222222-2222-4222-8222-222222222222';
const STARTED_AT = new Date('2026-10-11T10:00:00.000Z');
const COMPLETED_AT = new Date('2026-10-11T10:12:00.000Z');

const FORM: DiagnosticForm = createDiagnosticFormV1();

/**
 * An ordinary response profile: the last two items (both Pronunciation, b = 0.0 / 0.1) correct,
 * the rest wrong. `thetaOverall = −1.28 → cefr A1`, `startCefr A2 → les_a2_greetings_intro`;
 * every `theta_after`/`se_after` fits `NUMERIC(6,3)`. It is no longer a *special* pattern: under
 * ADR-025 the all-correct and all-wrong runs persist exactly as well (see the last two tests).
 */
function storableResponses(): Array<{ itemId: string; correct: boolean; responseTimeMs: number }> {
  return FORM.items.map((item, index) => ({
    itemId: item.id,
    correct: index >= 10,
    responseTimeMs: 1000 + index * 100,
  }));
}

function realRun(
  responses: Array<{
    itemId: string;
    correct: boolean;
    responseTimeMs: number;
  }> = storableResponses(),
): DiagnosticRun {
  return administerDiagnostic({
    learnerId: LEARNER_ID,
    sessionId: SESSION_ID,
    startedAt: STARTED_AT,
    completedAt: COMPLETED_AT,
    responses,
  });
}

/** Every item answered correctly — with `allWrongResponses`, the class the ledger refused. */
function allCorrectResponses() {
  return FORM.items.map((item, index) => ({
    itemId: item.id,
    correct: true,
    responseTimeMs: 1000 + index * 100,
  }));
}

/** Every item answered incorrectly — the pattern that used to sit at θ = 0 (A2) by construction. */
function allWrongResponses() {
  return FORM.items.map((item, index) => ({
    itemId: item.id,
    correct: false,
    responseTimeMs: 1000 + index * 100,
  }));
}

/**
 * Seed the FK targets the run references: CEFR codes, domains, the form's items, their skills,
 * and one lesson (plus its module) for `start_node`.
 *
 * Values are read off the run/form so the seed cannot drift from the bank.
 */
async function seedCatalogues(dataSource: DataSource, run: DiagnosticRun): Promise<void> {
  const cefr = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  for (const code of cefr) {
    await dataSource.query(
      `INSERT INTO cefr_levels (code, label, sort_order)
       VALUES ($1, $1, $2) ON CONFLICT (code) DO NOTHING`,
      [code, cefr.indexOf(code)],
    );
  }

  for (const domain of ['grammar', 'vocabulary', 'reading', 'pronunciation', 'listening']) {
    await dataSource.query(
      `INSERT INTO domains (id, label, tracked) VALUES ($1, $1, true)
       ON CONFLICT (id) DO NOTHING`,
      [domain],
    );
  }

  for (const item of FORM.items) {
    for (const skillId of item.skillIds) {
      await dataSource.query(
        `INSERT INTO skills (id, domain_id, label) VALUES ($1, $2, $1)
         ON CONFLICT (id) DO NOTHING`,
        [skillId, item.domainId],
      );
    }
    await dataSource.query(
      `INSERT INTO items (id, schema_version, skill_ids, cefr_level, domain_id, item_type,
                          modality, scoring, stem, key, p_random, provenance_kind)
       VALUES ($1, '2.0', $2, $3, $4, $5, $6, 'choice', $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [
        item.id,
        item.skillIds,
        item.cefrLevel,
        item.domainId,
        item.itemType,
        item.modality,
        item.stem,
        item.key,
        item.pRandom,
        item.provenanceKind,
      ],
    );
  }

  await dataSource.query(
    `INSERT INTO modules (id, title, cefr_level, track, source_markdowns, sort_order, expected_lessons)
     VALUES ('mod_test_placement', 'Placement test module', 'A1', 'General', ARRAY['test.md'], 0, 1)
     ON CONFLICT (id) DO NOTHING`,
  );
  await dataSource.query(
    `INSERT INTO lessons (id, module_id, title, cefr_level, reuse_basis, authoring_state,
                          publication_state, permission_state)
     VALUES ($1, 'mod_test_placement', 'Placement start node', 'A1', 'cite_only', 'authored',
             'publishable', 'not_required')
     ON CONFLICT (id) DO NOTHING`,
    [run.startNode],
  );
}

describe('DiagnosticResultRepository — P1.10 persistence (integration)', () => {
  let dataSource: DataSource;
  let cleanup: () => Promise<void>;
  let repository: DiagnosticResultRepository;

  beforeAll(async () => {
    const testDb = await createTestDb();
    dataSource = testDb.dataSource;
    cleanup = testDb.cleanup;
    repository = new DiagnosticResultRepository(dataSource);

    await dataSource.query(`INSERT INTO learners (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`, [
      LEARNER_ID,
    ]);
  });

  afterAll(async () => {
    await cleanup();
  });

  it('writes one diagnostic_results row and 12 diagnostic_responses rows', async () => {
    const run = realRun();
    await seedCatalogues(dataSource, run);

    const { diagnosticId, responseCount } = await repository.persist(run);

    expect(diagnosticId).toBeDefined();
    expect(responseCount).toBe(12);

    const [result] = await dataSource.query(`SELECT * FROM diagnostic_results WHERE id = $1`, [
      diagnosticId,
    ]);
    expect(result).toBeDefined();
    expect(result.learner_id).toBe(LEARNER_ID);
    expect(result.form_version).toBe(run.formVersion);

    const responses = await dataSource.query(
      `SELECT * FROM diagnostic_responses WHERE diagnostic_id = $1 ORDER BY id`,
      [diagnosticId],
    );
    expect(responses).toHaveLength(12);
    expect(run.responses).toHaveLength(12);
    for (const [index, response] of responses.entries()) {
      const expected = run.responses[index];
      expect(expected).toBeDefined();
      expect(response.diagnostic_id).toBe(diagnosticId);
      expect(response.learner_id).toBe(LEARNER_ID);
      expect(response.item_id).toBe(expected?.itemId);
      expect(response.skill_id).toBe(expected?.skillId);
      expect(response.correct).toBe(expected?.correct);
      expect(response.response_time_ms).toBe(expected?.responseTimeMs);
      expect(Number(response.theta_after)).toBeCloseTo(expected?.thetaAfter ?? 0, 3);
      expect(Number(response.se_after)).toBeCloseTo(expected?.seAfter ?? 0, 3);
    }
  });

  it('maps every scalar field from the run into the result row', async () => {
    const run = realRun();
    await seedCatalogues(dataSource, run);

    const { diagnosticId } = await repository.persist(run);
    const [result] = await dataSource.query(`SELECT * FROM diagnostic_results WHERE id = $1`, [
      diagnosticId,
    ]);

    expect(Number(result.theta)).toBeCloseTo(run.thetaOverall, 3);
    expect(Number(result.se_statistical)).toBeCloseTo(run.seStatistical, 3);
    expect(result.se_statistical).toBe(run.seStatistical.toFixed(3));
    expect(result.se_parameter).toBe(run.seParameter.toFixed(3));
    expect(Number(result.se_effective)).toBeCloseTo(run.seEffective, 3);
    expect(result.se_effective).toBe(run.seEffective.toFixed(3));
    expect(result.precision_label).toBe(run.precisionLabel);
    expect(result.precision_label).toBe('provisional');
    expect(result.stopping_rule).toBe('fixed_form_12_items');
    expect(result.cefr).toBe(run.cefr);
    expect(result.start_cefr).toBe(run.startCefr);
    expect(result.start_node).toBe(run.startNode);
    expect(result.below_scale).toBe(run.belowScale);
    expect(result.profile).toBe(run.profile);

    // §3.6 `overall.ci_95`, numeric to three decimals.
    expect(Number(result.ci95_lower)).toBeCloseTo(run.ci95Lower, 3);
    expect(Number(result.ci95_upper)).toBeCloseTo(run.ci95Upper, 3);

    // Lower bound is the run's `theta - 1.96·seOverall`, not the placement interval.
    // NUMERIC(6,3) stores three decimals, so the comparison is at that scale.
    expect(Number(result.ci95_lower)).toBeCloseTo(run.thetaOverall - 1.96 * run.seOverall, 3);
    expect(Number(result.ci95_upper)).toBeCloseTo(run.thetaOverall + 1.96 * run.seOverall, 3);
  });

  it('persists the run’s declared SE triple, not the realised one, in se_statistical/parameter/effective', async () => {
    const responses = FORM.items.map((item, index) => ({
      itemId: item.id,
      correct: index === 11,
      responseTimeMs: 1000,
    }));
    const run = realRun(responses);
    await seedCatalogues(dataSource, run);

    const { diagnosticId } = await repository.persist(run);
    const [result] = await dataSource.query(
      `SELECT se_statistical, se_parameter, se_effective, theta FROM diagnostic_results WHERE id = $1`,
      [diagnosticId],
    );

    // ADR-024 D6: the three declared disclosure values come from the bank (ADR-017 §1) and are
    // different numbers from the run's realised `seOverall`.
    expect(Number(result.se_statistical)).toBeCloseTo(run.seStatistical, 3);
    expect(Number(result.se_parameter)).toBeCloseTo(run.seParameter, 3);
    expect(Number(result.se_effective)).toBeCloseTo(run.seEffective, 3);
    expect(run.seStatistical).not.toBe(run.seEffective);
    expect(run.seOverall).not.toBe(run.seEffective);
  });

  it('serializes the §3.3a lattice into skill_theta keyed by domain, with the G-8 state discriminator', async () => {
    const run = realRun();
    await seedCatalogues(dataSource, run);

    const { diagnosticId } = await repository.persist(run);
    const [result] = await dataSource.query(
      `SELECT skill_theta FROM diagnostic_results WHERE id = $1`,
      [diagnosticId],
    );

    const lattice = result.skill_theta as Record<string, Record<string, unknown>>;
    // An object, not an array: G-8 validates it with `jsonb_each`, which rejects non-objects.
    // JSONB does not preserve key order (it sorts keys), so assert the key *set*. The run's
    // `DIAGNOSTIC_DOMAINS` order is not a storage property.
    expect(Array.isArray(lattice)).toBe(false);
    expect(Object.keys(lattice).sort()).toEqual(
      ['grammar', 'vocabulary', 'reading', 'pronunciation', 'listening'].sort(),
    );

    for (const entry of Object.values(lattice)) {
      expect(['point_estimate', 'band', 'insufficient_evidence']).toContain(entry['state']);
      expect(typeof entry['itemsAdministered']).toBe('number');
      if (entry['state'] === 'point_estimate') {
        expect(typeof entry['theta']).toBe('number');
        expect(typeof entry['se']).toBe('number');
        expect(typeof entry['cefr']).toBe('string');
      }
      if (entry['state'] === 'band') {
        expect(typeof entry['cefrBand']).toBe('string');
        expect(entry['theta']).toBeUndefined();
      }
      if (entry['state'] === 'insufficient_evidence') {
        expect(typeof entry['reason']).toBe('string');
      }
    }

    // This form is 4/3/3/2/0, so Grammar/Vocabulary/Reading are bands and Pronunciation and
    // Listening are gaps — no domain clears §3.3a's 5-item point-estimate floor.
    expect(lattice['grammar']?.['state']).toBe('band');
    expect(lattice['vocabulary']?.['state']).toBe('band');
    expect(lattice['reading']?.['state']).toBe('band');
    expect(lattice['pronunciation']?.['state']).toBe('insufficient_evidence');
    expect(lattice['listening']?.['state']).toBe('insufficient_evidence');

    expect(lattice).toEqual(serializeDomainThetas(run.domainThetas));
  });

  it('maps bktPriorsOverride (lowercase kt) onto the bkt_priors_override JSONB column', async () => {
    const run = realRun();
    await seedCatalogues(dataSource, run);

    expect(run.bktPriorsOverride).toEqual({});

    const { diagnosticId } = await repository.persist(run);
    const [result] = await dataSource.query(
      `SELECT bkt_priors_override FROM diagnostic_results WHERE id = $1`,
      [diagnosticId],
    );
    expect(result.bkt_priors_override).toEqual({});
  });

  it('maps a non-null profile and its remediation nodes into profile and remediation_nodes', async () => {
    // `profile` and `remediation_nodes` are the two §4 outputs. The override is kept, but under
    // ADR-025 its rationale is narrower than it was: a real *storable* run can now carry a
    // non-null `profile` — 288 of the form's 4096 response patterns derive
    // `false_beginner_suspected` plus `les_rem_confidence_builder` — whereas the old estimator's
    // `se_after` overflowed `NUMERIC(6,3)` on most such domain-θ contrasts, so this pair used to
    // be unreachable through the ledger. `les_rem_pronunciation_th_vw` needs pronunciation
    // θ < −1.0, which no run of this 2-item domain reaches. So the test overrides the pair on a
    // real run to exercise the *column* mapping of both nodes — P1.10's obligation — while the
    // diagnosis itself is ADR-024 D8's and is asserted in the fixed-form spec.
    const base = realRun();
    const run: DiagnosticRun = {
      ...base,
      profile: 'false_beginner_suspected',
      remediationNodes: ['les_rem_pronunciation_th_vw', 'les_rem_confidence_builder'],
    };
    await seedCatalogues(dataSource, run);

    const { diagnosticId } = await repository.persist(run);
    const [result] = await dataSource.query(
      `SELECT profile, remediation_nodes FROM diagnostic_results WHERE id = $1`,
      [diagnosticId],
    );
    expect(result.profile).toBe('false_beginner_suspected');
    expect(result.remediation_nodes).toEqual([
      'les_rem_pronunciation_th_vw',
      'les_rem_confidence_builder',
    ]);
  });

  it('stores remediation_nodes as a TEXT[] of at most 3 entries', async () => {
    const run = realRun();
    await seedCatalogues(dataSource, run);

    expect(run.remediationNodes.length).toBeLessThanOrEqual(MAX_REMEDIATION_NODES);

    const { diagnosticId } = await repository.persist(run);
    const [result] = await dataSource.query(
      `SELECT remediation_nodes FROM diagnostic_results WHERE id = $1`,
      [diagnosticId],
    );
    expect(result.remediation_nodes).toEqual(run.remediationNodes);
  });

  it('refuses a run with more than 3 remediation nodes before touching the database', async () => {
    const run = realRun();
    const overlong: DiagnosticRun = { ...run, remediationNodes: ['a', 'b', 'c', 'd'] };

    await expect(repository.persist(overlong)).rejects.toBeInstanceOf(DiagnosticPersistenceError);
  });

  it('rolls the result row back when a response row fails its FK (one transaction)', async () => {
    const run = realRun();
    await seedCatalogues(dataSource, run);

    const [beforeRow] = await dataSource.query(`SELECT count(*)::int AS n FROM diagnostic_results`);
    const corrupt: DiagnosticRun = {
      ...run,
      responses: run.responses.map((response, index) =>
        index === 1 ? { ...response, itemId: 'pb_does_not_exist' } : response,
      ),
    };

    await expect(repository.persist(corrupt)).rejects.toThrow();

    const [afterRow] = await dataSource.query(`SELECT count(*)::int AS n FROM diagnostic_results`);
    expect(afterRow.n).toBe(beforeRow.n);

    const orphans = await dataSource.query(
      `SELECT count(*)::int AS n FROM diagnostic_responses WHERE item_id = 'pb_does_not_exist'`,
    );
    expect(orphans[0].n).toBe(0);
  });

  it('joins a caller-supplied transaction and does not commit it', async () => {
    const run = realRun();
    await seedCatalogues(dataSource, run);

    const qr = dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    let diagnosticId: string;
    try {
      ({ diagnosticId } = await repository.persist(run, qr));
      // Visible inside the still-open transaction…
      const [inside] = await qr.query(`SELECT id FROM diagnostic_results WHERE id = $1`, [
        diagnosticId,
      ]);
      expect(inside).toBeDefined();
      // …and rolled back when the caller decides not to commit.
      await qr.rollbackTransaction();
    } finally {
      await qr.release();
    }

    const [outside] = await dataSource.query(`SELECT id FROM diagnostic_results WHERE id = $1`, [
      diagnosticId,
    ]);
    expect(outside).toBeUndefined();
  });

  it('persists an all-correct run — the class the previous estimator could not write', async () => {
    // ADR-025 closes the regression that surfaced this file: all-correct used to estimate
    // θ = 30.638 with `se_after` ≈ 2.2e6, so PostgreSQL rejected the row against `NUMERIC(6,3)`
    // and the single transaction rolled the whole run back. The honest estimate is θ = 1.46
    // → cefr B1 (the form's hardest item has b = 0.1, ADR-025 §6), and every se is finite.
    const run = realRun(allCorrectResponses());
    await seedCatalogues(dataSource, run);

    const { diagnosticId, responseCount } = await repository.persist(run);
    expect(responseCount).toBe(12);

    const [result] = await dataSource.query(
      `SELECT theta, cefr, start_cefr, start_node FROM diagnostic_results WHERE id = $1`,
      [diagnosticId],
    );
    expect(result).toBeDefined();
    expect(result.cefr).toBe('B1');
    expect(result.start_cefr).toBe('B1');
    expect(result.start_node).toBe(run.startNode);
    // `NUMERIC(6,3)` round-trip of the overall estimate: finite, signed and inside the column.
    expect(Number(result.theta)).toBeCloseTo(run.thetaOverall, 3);
    expect(Math.abs(Number(result.theta))).toBeLessThan(999.999);

    const responses = await dataSource.query(
      `SELECT theta_after, se_after FROM diagnostic_responses WHERE diagnostic_id = $1 ORDER BY id`,
      [diagnosticId],
    );
    expect(responses).toHaveLength(12);
    for (const [index, row] of responses.entries()) {
      const expected = run.responses[index]!;
      // The per-response pair is where the old write died: `se_after` is the prefix estimate.
      expect(Number(row.theta_after)).toBeCloseTo(expected.thetaAfter, 3);
      expect(Number(row.se_after)).toBeCloseTo(expected.seAfter, 3);
      expect(Number(row.se_after)).toBeGreaterThan(0);
      expect(Number(row.se_after)).toBeLessThan(999.999);
    }
  });

  it('persists an all-wrong run — the other half of the same defect', async () => {
    // The old estimator could not return θ < 0 at all: an all-wrong run sat at the population
    // mean (θ = 0 → cefr A2, `below_scale` false) though it had the *least* evidence on the form.
    // ADR-025 puts it below the A2 entry — θ = −2.07 → A1 with `below_scale` — and it stores.
    const run = realRun(allWrongResponses());
    await seedCatalogues(dataSource, run);

    const { diagnosticId, responseCount } = await repository.persist(run);
    expect(responseCount).toBe(12);

    const [result] = await dataSource.query(
      `SELECT theta, cefr, start_cefr, start_node, below_scale FROM diagnostic_results WHERE id = $1`,
      [diagnosticId],
    );
    expect(result).toBeDefined();
    expect(Number(result.theta)).toBeLessThan(0);
    expect(result.cefr).toBe('A1');
    expect(result.start_cefr).toBe('A1');
    expect(result.below_scale).toBe(true);
    expect(result.start_node).toBe(run.startNode);

    const responses = await dataSource.query(
      `SELECT theta_after, se_after FROM diagnostic_responses WHERE diagnostic_id = $1 ORDER BY id`,
      [diagnosticId],
    );
    expect(responses).toHaveLength(12);
    for (const [index, row] of responses.entries()) {
      const expected = run.responses[index]!;
      expect(Number(row.theta_after)).toBeCloseTo(expected.thetaAfter, 3);
      expect(Number(row.se_after)).toBeCloseTo(expected.seAfter, 3);
      expect(Number(row.se_after)).toBeGreaterThan(0);
      expect(Number(row.se_after)).toBeLessThan(999.999);
    }
  });
});

/**
 * ADR-026 — the same repository, as the role the application actually runs as.
 *
 * The `describe` above connects as the table owner, which bypasses ADR-003's `learner_isolation`
 * policy (`relforcerowsecurity = false`), so it cannot tell a `persist()` that sets
 * `app.current_learner_id` from one that does not. This describe can: it takes
 * `SET ROLE its_platform_app` — the role the migration creates and grants — and drives the write
 * through `PgSessionContext`, the single writer of the GUC.
 *
 * Role state is connection-scoped and the harness shares one connection, so every test restores
 * with `RESET ROLE` in a `finally`. It is a separate database from the owner-role describe so the
 * role switch and its fixture cannot bleed across.
 */
describe('DiagnosticResultRepository — ADR-003 RLS as its_platform_app (ADR-026)', () => {
  let dataSource: DataSource;
  let cleanup: () => Promise<void>;
  let repository: DiagnosticResultRepository;
  let sessionContext: PgSessionContext;

  const OTHER_LEARNER_ID = '33333333-3333-4333-8333-333333333333';

  beforeAll(async () => {
    const testDb = await createTestDb();
    dataSource = testDb.dataSource;
    cleanup = testDb.cleanup;
    repository = new DiagnosticResultRepository(dataSource);
    sessionContext = new PgSessionContext(dataSource);

    await dataSource.query(`INSERT INTO learners (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`, [
      LEARNER_ID,
    ]);
  });

  afterAll(async () => {
    await cleanup();
  });

  it('refuses a context-less persist() as the app role, writing no result row', async () => {
    // ADR-026 probe 2 — the defect. Without the GUC the policy's WITH CHECK is false and the
    // INSERT is refused. The count is taken as the owner (below, before/after `SET ROLE`) so the
    // "no row written" assertion is not itself filtered by the policy.
    const run = realRun();
    await seedCatalogues(dataSource, run);

    const [beforeRow] = await dataSource.query(`SELECT count(*)::int AS n FROM diagnostic_results`);

    await dataSource.query(`SET ROLE its_platform_app`);
    try {
      await expect(repository.persist(run)).rejects.toThrow(/row-level security policy/);
    } finally {
      await dataSource.query(`RESET ROLE`);
    }

    const [afterRow] = await dataSource.query(`SELECT count(*)::int AS n FROM diagnostic_results`);
    expect(afterRow.n).toBe(beforeRow.n);
  });

  it('persists the same run through withLearner(...) under the app role', async () => {
    // ADR-026 probe 3: role + transaction + `set_config(..., true)` is the whole difference
    // between a run that is refused and a run that stores. `seedCatalogues` supplies the run's FK
    // targets, the same fixture the owner-role tests use.
    const run = realRun();
    await seedCatalogues(dataSource, run);

    const persisted = await (async () => {
      await dataSource.query(`SET ROLE its_platform_app`);
      try {
        return await sessionContext.withLearner(LEARNER_ID, async tx => {
          const result = await repository.persist(run, tx);
          const [row] = await tx.query(
            `SELECT count(*)::int AS n FROM diagnostic_responses WHERE diagnostic_id = $1`,
            [result.diagnosticId],
          );
          return { result, responsesInside: row.n as number };
        });
      } finally {
        await dataSource.query(`RESET ROLE`);
      }
    })();

    expect(persisted.result.responseCount).toBe(12);
    expect(persisted.responsesInside).toBe(12);

    // Read back as the owner after COMMIT: the run is really stored, not merely visible to the
    // transaction that wrote it.
    const [result] = await dataSource.query(
      `SELECT learner_id, form_version FROM diagnostic_results WHERE id = $1`,
      [persisted.result.diagnosticId],
    );
    expect(result).toBeDefined();
    expect(result.learner_id).toBe(LEARNER_ID);
    expect(result.form_version).toBe(run.formVersion);

    const [responses] = await dataSource.query(
      `SELECT count(*)::int AS n FROM diagnostic_responses WHERE diagnostic_id = $1`,
      [persisted.result.diagnosticId],
    );
    expect(responses.n).toBe(12);
  });

  it('refuses a run whose learner does not match the session context (WITH CHECK)', async () => {
    // ADR-026 probe 4 — fail-closed. A context for learner B cannot write learner A's row, so a
    // mis-wired caller cannot reach across learners even though the role is granted on the table.
    const run = realRun();
    await seedCatalogues(dataSource, run);

    await dataSource.query(`SET ROLE its_platform_app`);
    try {
      await expect(
        sessionContext.withLearner(OTHER_LEARNER_ID, tx => repository.persist(run, tx)),
      ).rejects.toThrow(/row-level security policy/);
    } finally {
      await dataSource.query(`RESET ROLE`);
    }
  });

  it('scopes the GUC to the transaction: it is the learner inside, and gone after COMMIT', async () => {
    // ADR-026 §3, measured on real PostgreSQL 15.17: after COMMIT the GUC is the empty-string
    // placeholder, not NULL and not the learner's id. Either way it is not a usable context, so the
    // assertion is "not the learner id" rather than a claim about the placeholder's exact value.
    const observed = await (async () => {
      await dataSource.query(`SET ROLE its_platform_app`);
      try {
        const inside = await sessionContext.withLearner(LEARNER_ID, async tx => {
          const [row] = await tx.query(
            `SELECT current_setting('app.current_learner_id', true) AS ctx`,
          );
          return row.ctx as string | null;
        });
        const [afterRow] = await dataSource.query(
          `SELECT current_setting('app.current_learner_id', true) AS ctx`,
        );
        return { inside, after: afterRow.ctx as string | null };
      } finally {
        await dataSource.query(`RESET ROLE`);
      }
    })();

    expect(observed.inside).toBe(LEARNER_ID);
    expect(observed.after).not.toBe(LEARNER_ID);
  });

  it('does not carry one learner’s context into the next transaction on the connection', async () => {
    // The pooled-connection leak ADR-026 §3 exists to make impossible: a second `withLearner` on
    // the same connection must see its own id, never the previous transaction's.
    const next = await (async () => {
      await dataSource.query(`SET ROLE its_platform_app`);
      try {
        await sessionContext.withLearner(LEARNER_ID, async () => undefined);
        return await sessionContext.withLearner(OTHER_LEARNER_ID, async tx => {
          const [row] = await tx.query(
            `SELECT current_setting('app.current_learner_id', true) AS ctx`,
          );
          return row.ctx as string | null;
        });
      } finally {
        await dataSource.query(`RESET ROLE`);
      }
    })();

    expect(next).toBe(OTHER_LEARNER_ID);
  });

  it('refuses a blank learner id before opening a connection', async () => {
    await expect(sessionContext.withLearner('   ', async () => undefined)).rejects.toBeInstanceOf(
      LearnerContextError,
    );
  });
});
