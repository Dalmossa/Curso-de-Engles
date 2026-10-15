/**
 * A7 — the five learner-scoped responses: what each body is a function of, and of what it is not.
 *
 * A5b measured the **status** of these five routes (`learner-scope-rls.spec.ts`): the cross-learner
 * 404 is the policy's answer. It left the **bodies** alone on purpose — a human ratified *"only the
 * read the RLS governs"* for that phase — and `docs/api/inventario.md` §6.8 had already recorded what
 * the bodies are: members that ADR-015 §3 and ADR-018 §9 removed from the schema, served anyway; a θ
 * published without the reportability `diagnostic-spec.md` §3.6 requires; `gate_passed` published as
 * a constant while ADR-018 §6.1 defines it as a predicate over five clauses of evidence.
 *
 * This file is the executable form of that measurement, and it holds its two halves. Under `A7b` the
 * assertions describe the behaviour **after** `GET …/profile` was made a function of the tables it
 * names (ADR-045 D3–D6); everywhere else they still describe the defect as it stands, so each is
 * meant to be **inverted** by the implementation that closes it. A failure here does not mean the
 * test is wrong — it means the behaviour moved, and the assertion was the address of the behaviour.
 *
 * One assertion is **held** rather than inverted, and it says so where it is: `theta_estimates`
 * stays `{}` while the table holds a θ, because ADR-045 D6 holds that member until ADR-043 R1 (H3)
 * ratifies whether θ and its `se` leave the API at all.
 *
 * Four oracles, and no claim without one:
 *
 *   * the **catalogue** (`information_schema`) answers what a column *can* hold — `learners` has no
 *     `cefr_level`, `streak_days` or `xp`, and `item_responses` has no transition column;
 *   * the **row the seed wrote** answers what the body could have read — `created_at` at 2020-01-01,
 *     `p_know` 0.930/0.050, `theta` 1.200, `stability` 12.5, `cefr` C1 — read back out of the same
 *     tables rather than repeated from the handler;
 *   * the **published document** answers what a response is documented to contain — the two halves of
 *     `PlacementResult.confidence`, which is `required` and undeclared;
 *   * a **domain service** answers the predicate — `MasteryGateService`, over the row the seed wrote.
 *
 * The claims are about *derivation*, not about values: the seed writes every table the five
 * declarations name as a source, with values chosen to be unmistakable if they are ever read, and the
 * assertion is that the responses do not move. The control for that shape of claim is the second test
 * of the first `describe` — the rows are really there.
 *
 * The connection is left as the **owner** of the tables here. Which row is visible is A5b's question —
 * its own file measures both roles — and what this file measures is what a handler does with the row
 * it has, which the owner connection makes answerable for the learner the seed writes.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

import * as yaml from 'yaml';

import { MasteryGateService } from '../../src/domain/services/mastery-gate.service.js';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import { startLearnerRoutesApp, type LearnerRoutesApp } from '../helpers/learner-routes-app.js';

/** The learner this file writes, asks about, and reads the answers of. */
const LEARNER = 'a1000000-0000-4000-8000-000000000001';
/** A second learner, whose only role is to be the *other* answer to the same question. */
const OTHER = 'a1000000-0000-4000-8000-000000000002';
/**
 * A third learner, written only by the one test that needs two runs in a chosen order.
 *
 * It exists because the seed writes **one** diagnostic for `LEARNER`, and a member whose definition is
 * "the *latest* run" cannot be measured against a fixture that has only one: the ordering word is the
 * whole of D3's claim, and a single row answers it by accident no matter how the statement is written.
 */
const ORDERING = 'a1000000-0000-4000-8000-000000000003';
const PACK = 'pack_les_a2_airport_v1';

/** A parsed JSON object, before it is given the shape of one published response. */
type Json = Record<string, unknown>;

interface ProfileBody extends Json {
  learner_id: string;
  created_at: string;
  /** `null` while the learner has completed no diagnostic — ADR-045 D3. */
  cefr_level: string | null;
  mastery: Record<string, number>;
  theta_estimates: Record<string, unknown>;
  fsrs_states: Record<string, unknown>;
  preferences: Record<string, unknown>;
}

interface MasteryBody extends Json {
  [skill: string]: { mastery: number; gate_passed: boolean; last_practice: string };
}

interface PlacementBody extends Json {
  learner_id: string;
  start_node: string;
  theta_estimate: { theta: number; se: number; ci95: number[] };
}

interface PracticeBody extends Json {
  pack_id: string;
  scored_items: Array<Json & { item_id: string; correct: boolean; bkt_update: Json }>;
}

interface NextBody extends Json {
  activity_id: string;
  rationale: Json & { selection_rule: string; mastery_gaps: string[]; i_plus_1: boolean };
}

// ---------------------------------------------------------------------------
// The canonical document — read the way `tests/contract/schemas.spec.ts` reads it
// ---------------------------------------------------------------------------

const SPEC_PATH = 'docs/api-spec.openapi.yaml';

interface ContractDocument {
  components: { schemas: Record<string, unknown> };
}

/**
 * The canonical document, parsed as bare YAML. This reader does not look for a ```` ```yaml ````
 * fence: the fence was the historical defect (ADR-040 D2) and a reader that tolerates it hides the
 * defect instead of reporting it. It is a reader, not a validator — the document is consulted here to
 * quote `required`, `properties` and `default` as the oracle of three claims.
 */
function loadSpec(relativePath: string): ContractDocument {
  const parsed = yaml.parse(readFileSync(join(process.cwd(), relativePath), 'utf8')) as unknown;
  if (parsed === null || typeof parsed !== 'object') {
    throw new Error(`${relativePath} did not parse to an object`);
  }
  return parsed as ContractDocument;
}

const spec = loadSpec(SPEC_PATH);

/** `components.schemas[name]` of the canonical document, or a failure that names what is missing. */
function schema(name: string): unknown {
  const found = spec.components.schemas[name];
  if (found === undefined) throw new Error(`${SPEC_PATH} has no components.schemas.${name}`);
  return found;
}

// ---------------------------------------------------------------------------
// The five published responses
// ---------------------------------------------------------------------------

let testDb: TestDbContext;
let started: LearnerRoutesApp;
let AUTH: Record<string, string> = {};

async function sql<T>(query: string, params: unknown[] = []): Promise<T[]> {
  return (await testDb.dataSource.query(query, params)) as T[];
}

/** The single row a fixture query expects — named here so a missing row fails as a fixture, loudly. */
async function one<T>(query: string, params: unknown[] = []): Promise<T> {
  const rows = await sql<T>(query, params);
  if (rows.length !== 1) throw new Error(`expected 1 row, got ${rows.length}: ${query}`);
  return rows[0] as T;
}

const count = async (query: string, params: unknown[] = []): Promise<number> =>
  Number((await one<{ n: number }>(query, params)).n);

async function ok(response: Response): Promise<unknown> {
  if (response.status !== 200) {
    throw new Error(`expected 200, got ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

const get = (path: string): Promise<unknown> =>
  fetch(`${started.base}${path}`, { headers: AUTH }).then(ok);

const post = (path: string, body: unknown): Promise<unknown> =>
  fetch(`${started.base}${path}`, {
    method: 'POST',
    headers: { ...AUTH, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }).then(ok);

const profileOf = async (learnerId: string): Promise<ProfileBody> =>
  (await get(`/api/v1/learners/${learnerId}/profile`)) as ProfileBody;
const masteryOf = async (learnerId: string): Promise<MasteryBody> =>
  (await get(`/api/v1/learners/${learnerId}/mastery`)) as MasteryBody;
const nextOf = async (learnerId: string): Promise<NextBody> =>
  (await get(`/api/v1/learners/${learnerId}/next`)) as NextBody;
const place = async (learnerId: string): Promise<PlacementBody> =>
  (await post(`/api/v1/learners/${learnerId}/placement`, {
    learner_id: learnerId,
    mode: 'adaptive',
  })) as PlacementBody;
const practice = async (learnerId: string, itemId: string): Promise<PracticeBody> =>
  (await post(`/api/v1/learners/${learnerId}/practice`, {
    learner_id: learnerId,
    pack_id: PACK,
    responses: [{ item_id: itemId, response: 'A', response_time_ms: 900 }],
  })) as PracticeBody;

async function fiveBodies(): Promise<Record<string, unknown>> {
  return {
    profile: await profileOf(LEARNER),
    mastery: await masteryOf(LEARNER),
    next: await nextOf(LEARNER),
    placement: await place(LEARNER),
    practice: await practice(LEARNER, 'voc_airport_001'),
  };
}

/**
 * One member of the remaining bodies is the clock rather than the database: `mastery.*.last_practice`
 * is built with `new Date()` in the handler (A7c's to fix). Comparing two readings of a clock would
 * fail for a reason that is not the one under measurement, so it is replaced — here, explicitly, and
 * nowhere else.
 *
 * `profile.created_at` used to be normalised by this function too, and A7b is why it no longer is:
 * it is now the value of `learners.created_at`, and a stored value compared after being rewritten as
 * `<clock>` is exactly the assertion that could not tell the two apart. `profile.created_at` and
 * `profile.cefr_level` also left the fingerprint below for the same reason — a body that is a
 * function of the seed cannot be asserted equal before and after the seed runs.
 */
function withoutTheClock(body: unknown): Json {
  const copy = structuredClone(body) as Json;
  for (const value of Object.values(copy)) {
    if (value !== null && typeof value === 'object' && 'last_practice' in (value as object)) {
      (value as Json)['last_practice'] = '<clock>';
    }
  }
  return copy;
}

// ---------------------------------------------------------------------------
// The seed: every table the five declarations name as a source
// ---------------------------------------------------------------------------

/**
 * Idempotent, so no test depends on another's order. Every value below is chosen to be unmistakable
 * if it is ever read:
 *
 * | written | table | the value |
 * |---|---|---|
 * | the learner's own row | `learners` | `created_at` **2020-01-01** |
 * | two BKT posteriors and their evidence counts | `learner_mastery` | `grammar.articles` **0.930** with the counts §6.1's gate needs; `vocabulary.airport` **0.050** |
 * | an IRT estimate | `theta_estimates` | `grammar.articles` θ **1.200** |
 * | a completed diagnostic | `diagnostic_results` | **C1**, `start_node` **`les_c1_test`** (ERD §6.1: *current CEFR = latest completed `diagnostic_results.cefr`*) |
 * | an FSRS state | `fsrs_states` | stability **12.5** for one item |
 * | one attempt and one response | `sessions`/`practice_attempts`/`item_responses` | `bkt_prior` 0.850, `bkt_posterior` 0.920, `correct` **false** |
 */
async function seedEverything(): Promise<void> {
  await sql(
    `UPDATE learners SET created_at = '2020-01-01T00:00:00Z', last_active_at = '2020-01-02T00:00:00Z' WHERE id = $1`,
    [LEARNER],
  );

  await sql(
    `INSERT INTO domains (id, label) VALUES ('grammar', 'Grammar'), ('vocabulary', 'Vocabulary') ON CONFLICT (id) DO NOTHING`,
  );
  await sql(
    `INSERT INTO skills (id, domain_id, label) VALUES ('grammar.articles', 'grammar', 'Articles'), ('vocabulary.airport', 'vocabulary', 'Airport') ON CONFLICT (id) DO NOTHING`,
  );

  await sql(
    `INSERT INTO learner_mastery (learner_id, skill_id, p_know, n_obs, distinct_days, spaced_obs, last_practice_at)
     VALUES ($1, 'grammar.articles', 0.930, 4, 3, 2, now() - interval '1 day'),
            ($1, 'vocabulary.airport', 0.050, 1, 1, 0, now() - interval '2 days')
     ON CONFLICT (learner_id, skill_id) DO UPDATE SET p_know = EXCLUDED.p_know, n_obs = EXCLUDED.n_obs`,
    [LEARNER],
  );

  await sql(
    `INSERT INTO theta_estimates (learner_id, skill_id, theta, se, ci95_lower, ci95_upper, evidence_count)
     VALUES ($1, 'grammar.articles', 1.200, 0.300, 0.612, 1.788, 12)
     ON CONFLICT (learner_id, skill_id) DO UPDATE SET theta = 1.200, se = 0.300`,
    [LEARNER],
  );

  await sql(
    `INSERT INTO cefr_levels (code, label, sort_order) VALUES ('A2', 'Elementary', 2), ('B2', 'Upper intermediate', 4), ('C1', 'Advanced', 5) ON CONFLICT (code) DO NOTHING`,
  );
  await sql(
    `INSERT INTO modules (id, title, cefr_level, track, source_markdowns, sort_order, expected_lessons)
     VALUES ('mod_c1_test', 'C1 test module', 'C1', 'General', '{}'::text[], 90, 1) ON CONFLICT (id) DO NOTHING`,
  );
  await sql(
    `INSERT INTO lessons (id, module_id, title, cefr_level, reuse_basis, authoring_state, publication_state, permission_state)
     VALUES ('les_c1_test', 'mod_c1_test', 'A C1 lesson', 'C1', 'cite_only', 'authored', 'publishable', 'not_required')
     ON CONFLICT (id) DO NOTHING`,
  );
  await sql(
    `INSERT INTO diagnostic_results
       (learner_id, theta, se_statistical, se_parameter, se_effective, precision_label, ci95_lower, ci95_upper,
        cefr, start_cefr, start_node, stopping_rule, skill_theta, profile)
     SELECT $1, 1.900, 0.300, 0.310, 0.430, 'provisional', 1.257, 2.543,
            'C1', 'B2', 'les_c1_test', 'se_threshold', '{"grammar": {"theta": 1.9}}'::jsonb, 'steady'
      WHERE NOT EXISTS (SELECT 1 FROM diagnostic_results WHERE learner_id = $1)`,
    [LEARNER],
  );

  await sql(
    `INSERT INTO fsrs_parameters (w_version, w, decay, factor, is_active)
     VALUES ('w_test', '[0.40255,1.18385,3.173,15.69105,7.1949,0.5345,1.4604,0.0046,1.54575,0.1192,1.01925,1.9395,0.11,0.29605,2.2698,0.2315,2.9898,0.51655,0.6621,0.0,0.0]'::jsonb, 0.5000, 19.0000, false)
     ON CONFLICT (w_version) DO NOTHING`,
  );
  await sql(
    `INSERT INTO items (id, skill_ids, cefr_level, domain_id, item_type, modality, stem, p_random, provenance_kind)
     VALUES ('vocab.airport.001', ARRAY['vocabulary.airport'], 'A2', 'vocabulary', 'contextual_selection', 'text', 'The gate is ___.', 0.2500, 'authored')
     ON CONFLICT (id) DO NOTHING`,
  );
  await sql(
    `INSERT INTO fsrs_states (learner_id, item_id, stability, difficulty, state, last_review, due_date, w_version)
     VALUES ($1, 'vocab.airport.001', 12.500, 5.200, 'review', now() - interval '3 days', '2026-12-31', 'w_test')
     ON CONFLICT (learner_id, item_id) DO UPDATE SET stability = 12.500`,
    [LEARNER],
  );

  await sql(
    `INSERT INTO sessions (id, learner_id)
     SELECT 'b1000000-0000-4000-8000-000000000001'::uuid, $1
      WHERE NOT EXISTS (SELECT 1 FROM sessions WHERE learner_id = $1)`,
    [LEARNER],
  );
  await sql(
    `INSERT INTO practice_attempts (session_id, learner_id, pack_layer, pack_id, total_items, correct_count)
     SELECT s.id, $1, 'L2', NULL, 1, 0
       FROM sessions s
      WHERE s.learner_id = $1 AND NOT EXISTS (SELECT 1 FROM practice_attempts WHERE learner_id = $1)`,
    [LEARNER],
  );
  await sql(
    `INSERT INTO item_responses (attempt_id, learner_id, item_id, response, correct, response_time_ms, bkt_prior, bkt_posterior)
     SELECT a.id, $1, 'vocab.airport.001', 'A', false, 900, 0.850, 0.920
       FROM practice_attempts a
      WHERE a.learner_id = $1 AND NOT EXISTS (SELECT 1 FROM item_responses WHERE learner_id = $1)`,
    [LEARNER],
  );
}

beforeAll(async () => {
  testDb = await createTestDb();

  // Both rows exist as the owner, before anything is measured: the second is what the "differs in one
  // member" test reads, and a learner that was never written would make its answer indistinguishable
  // from a fixture that wrote nothing.
  await sql(`INSERT INTO learners (id) VALUES ($1), ($2) ON CONFLICT (id) DO NOTHING`, [
    LEARNER,
    OTHER,
  ]);

  started = await startLearnerRoutesApp(testDb.dataSource);
  AUTH = await started.auth(LEARNER);
});

afterAll(async () => {
  await started.close();
  await testDb.cleanup();
});

describe('A7 — the bodies that are still constant functions of the database', () => {
  it('answers the same four bodies before and after the tables are written — and the profile does not', async () => {
    const before = await fiveBodies();

    await seedEverything();

    const after = await fiveBodies();

    // The assertion that was made of five routes and is now made of four: not "member X is stubbed"
    // but "these four responses are constant functions of the database", and every claim below is a
    // consequence of this one, named member by member.
    for (const route of ['mastery', 'next', 'placement', 'practice'] as const) {
      expect({ route, body: withoutTheClock(after[route]) }).toEqual({
        route,
        body: withoutTheClock(before[route]),
      });
    }

    // The fifth route left this loop by **moving**, which is A7b: `GET …/profile` is now a function of
    // `learners.created_at`, of the latest completed run, of `learner_mastery` and of `fsrs_states`.
    // A body that moves cannot be compared with itself across the seed — and this assertion is also
    // the control that keeps the loop above honest: if the seed wrote nothing, the profile would not
    // move either, and both would be green for the wrong reason.
    expect(after['profile']).not.toEqual(before['profile']);
  });

  it('writes the rows it claims to write, so the test above cannot pass on an empty fixture', async () => {
    await seedEverything();

    expect(
      await count(`SELECT count(*)::int AS n FROM learner_mastery WHERE learner_id = $1`, [LEARNER]),
    ).toBe(2);
    expect(
      await count(`SELECT count(*)::int AS n FROM theta_estimates WHERE learner_id = $1`, [LEARNER]),
    ).toBe(1);
    expect(
      await count(`SELECT count(*)::int AS n FROM fsrs_states WHERE learner_id = $1`, [LEARNER]),
    ).toBe(1);
    expect(
      await count(`SELECT count(*)::int AS n FROM item_responses WHERE learner_id = $1`, [LEARNER]),
    ).toBe(1);

    expect(
      await one<{ cefr: string; start_node: string }>(
        `SELECT cefr, start_node FROM diagnostic_results WHERE learner_id = $1`,
        [LEARNER],
      ),
    ).toEqual({ cefr: 'C1', start_node: 'les_c1_test' });
  });
});

describe('A7b — the profile is a function of the tables it names (ADR-045 D3–D5)', () => {
  it('serves created_at as the value the row has held since 2020, not the clock', async () => {
    await seedEverything();

    const body = await profileOf(LEARNER);
    const row = await one<{ created_at: Date }>(
      `SELECT created_at FROM learners WHERE id = $1`,
      [LEARNER],
    );

    // The row first: six years old, and the value the body must carry. The equality below is the whole
    // measurement — the body it replaces answered `new Date()`, which no part of this expression can
    // be, so the assertion is not "a date is present" but "this date is the row's".
    expect(row.created_at.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    expect(body.created_at).toBe(row.created_at.toISOString());
  });

  it('serves cefr_level from the learner’s latest completed run, and null when there is none', async () => {
    await seedEverything();

    const body = await profileOf(LEARNER);
    const run = await one<{ cefr: string }>(
      `SELECT cefr FROM diagnostic_results WHERE learner_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [LEARNER],
    );

    // ERD §2 correction 9: the current band is the `cefr` of the latest completed `diagnostic_results`
    // row (ADR-017 §3), which for this learner is C1 — the handler answered the literal 'A2'.
    expect(run.cefr).toBe('C1');
    expect(body.cefr_level).toBe(run.cefr);

    // D3's other half, and the half a fixture can fake: no run is `null`, not a band. The second
    // learner has no run at all, and the count is read back first so this cannot pass on a fixture
    // that wrote one.
    expect(
      await count(`SELECT count(*)::int AS n FROM diagnostic_results WHERE learner_id = $1`, [OTHER]),
    ).toBe(0);
    expect((await profileOf(OTHER)).cefr_level).toBeNull();

    // And the contract had to be amended for that: the member stays `required` — it is always
    // present — while its type widens to admit the absence the table can produce. A member that is
    // `required` and can be `null` is exactly what "not yet assessed" needs, and the alternative
    // spellings (a sentinel band, a 404 on the profile) were measured and rejected in D3.
    const learnerProfile = schema('LearnerProfile') as {
      required: string[];
      properties: Record<string, { type: unknown }>;
    };
    expect(learnerProfile.required).toContain('cefr_level');
    expect(learnerProfile.properties['cefr_level']?.type).toEqual(['string', 'null']);
  });

  it('answers the latest run — not the first, not the highest, and not merely any', async () => {
    await seedEverything();

    // A learner of its own, written here rather than in `beforeAll` because this is the only test that
    // reads it: what varies is the *order* of one learner's runs, and `LEARNER` cannot carry that
    // fixture without changing what every other test in this file reads. `start_node` is a FK into
    // `lessons` and the seed's single lesson satisfies it for all three runs — the column under
    // measurement is `cefr`.
    await sql(`INSERT INTO learners (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`, [ORDERING]);

    const writeRun = (cefr: string, at: string) =>
      sql(
        `INSERT INTO diagnostic_results
           (learner_id, theta, se_statistical, se_parameter, se_effective, precision_label,
            ci95_lower, ci95_upper, cefr, start_cefr, start_node, stopping_rule, skill_theta,
            profile, created_at)
         VALUES ($1, 0.500, 0.300, 0.310, 0.430, 'provisional', -0.088, 1.088,
                 $2, $2, 'les_c1_test', 'se_threshold', '{"grammar": {"theta": 0.5}}'::jsonb,
                 'steady', $3)`,
        [ORDERING, cefr, at],
      );

    // One run is written first, so that the two assertions below are read against an answer that
    // exists rather than against `null`.
    await writeRun('C1', '2022-01-01T00:00:00Z');
    expect((await profileOf(ORDERING)).cefr_level).toBe('C1');

    // An **earlier** run answers nothing. This is the assertion a statement with no `ORDER BY` cannot
    // make: two rows are now candidates, and "whichever the planner returned first" is not a rule.
    await writeRun('B2', '2021-01-01T00:00:00Z');
    expect((await profileOf(ORDERING)).cefr_level).toBe('C1');

    // A **later** run wins, and it wins while being a *lower* band than both runs before it — which is
    // what rules out the two readings of the column that are not ERD §6.1's: the first run written, and
    // the highest band reached. A learner can go down as well as up; `cefr_level` is where they are.
    await writeRun('A2', '2023-01-01T00:00:00Z');
    expect((await profileOf(ORDERING)).cefr_level).toBe('A2');
  });

  it('serves mastery keyed by the learner’s own skills, with p_know from the row', async () => {
    await seedEverything();

    const body = await profileOf(LEARNER);
    const strong = await one<{ p_know: string }>(
      `SELECT p_know FROM learner_mastery WHERE learner_id = $1 AND skill_id = 'grammar.articles'`,
      [LEARNER],
    );
    const weak = await one<{ p_know: string }>(
      `SELECT p_know FROM learner_mastery WHERE learner_id = $1 AND skill_id = 'vocabulary.airport'`,
      [LEARNER],
    );

    // The keys are the content: the schema is a bare `additionalProperties` map, so *which* skills
    // appear is the whole answer. The learner's skills are the two catalogue ids below — not
    // `grammar`/`vocab`, which are what the handler chose, and not skills this learner has no
    // evidence for.
    expect(Object.keys(body.mastery).sort()).toEqual(['grammar.articles', 'vocabulary.airport']);
    expect(body.mastery).toEqual({
      'grammar.articles': Number(strong.p_know),
      'vocabulary.airport': Number(weak.p_know),
    });
    expect(Number(strong.p_know)).toBeCloseTo(0.93, 3);
    expect(Number(weak.p_know)).toBeCloseTo(0.05, 3);
  });

  it('serves fsrs_states from the rows, keyed by item, with the members the document requires', async () => {
    await seedEverything();

    const body = await profileOf(LEARNER);
    const row = await one<{ stability: string; difficulty: string; last_review: Date }>(
      `SELECT stability, difficulty, last_review FROM fsrs_states WHERE learner_id = $1`,
      [LEARNER],
    );

    // Keyed by item, and each value is the row's own three members: NUMERIC arrives as a string and is
    // normalised to a number (the contract declares both as `type: number`), and `last_review` as an
    // RFC 3339 instant.
    expect(Number(row.stability)).toBeCloseTo(12.5, 3);
    expect(Object.keys(body.fsrs_states)).toEqual(['vocab.airport.001']);
    expect(body.fsrs_states).toEqual({
      'vocab.airport.001': {
        stability: Number(row.stability),
        difficulty: Number(row.difficulty),
        last_review: row.last_review.toISOString(),
      },
    });

    // The document is the shape oracle: the served object carries exactly the members `fsrs_states`
    // declares as `required` — no more (nothing invented alongside them) and no fewer. The member is a
    // map, so the obligation lives on `additionalProperties`, not on the map itself.
    const learnerProfile = schema('LearnerProfile') as {
      properties: { fsrs_states: { additionalProperties: { required: string[] } } };
    };
    const served = (body.fsrs_states as Record<string, Record<string, unknown>>)[
      'vocab.airport.001'
    ];
    if (served === undefined) throw new Error('the profile served no FSRS state to inspect');
    expect(Object.keys(served).sort()).toEqual(
      [...learnerProfile.properties.fsrs_states.additionalProperties.required].sort(),
    );
  });

  it('serves preferences equal to the document’s own defaults — 15, not 20', async () => {
    const body = await profileOf(LEARNER);

    // No table stores a preference (read back below), so the document's `default:` is the only
    // artefact that can answer this member, and D5 is that the server answers exactly it. The handler
    // answered 20 where the document said 15 — a value no artefact holds and no declaration
    // authorises, which is the one form a client cannot tell from a stored preference.
    const tables = (
      await sql<{ table_name: string }>(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%preference%'`,
      )
    ).map((row) => row.table_name);
    expect(tables).toEqual([]);

    const learnerProfile = schema('LearnerProfile') as {
      properties: {
        preferences: { properties: Record<string, { default?: unknown }> };
      };
    };
    const declared = learnerProfile.properties.preferences.properties;
    const defaults = Object.fromEntries(
      Object.entries(declared).map(([name, member]) => [name, member.default]),
    );

    // Every member, not only the one that was wrong: the response and the declaration are the same
    // object, which is what "the default is the answer" means.
    expect(body.preferences).toEqual(defaults);
    expect(body.preferences['daily_goal_minutes']).toBe(15);
  });

  it('serves neither streak_days nor xp, and neither the row nor the document can hold them', async () => {
    const body = await profileOf(LEARNER);

    // The catalogue first: the whole of the learner's row is these four columns, and the members the
    // response used to publish off it are not among them (ERD §2 corrections 9/10, §6.5 —
    // *"Gamification has no persistence at all (ADR-015 §3)"*).
    const columns = (
      await sql<{ column_name: string }>(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'learners' ORDER BY column_name`,
      )
    ).map((row) => row.column_name);
    expect(columns).toEqual(['created_at', 'id', 'last_active_at', 'updated_at']);

    // D4 is removal from **both** halves, and both are asserted here: a member declared and served is
    // a claim about an artefact that does not exist, and `default: 0` gives it the appearance of a
    // fact. A body without the members but a document with them would still be a promise.
    expect(Object.keys(body)).not.toContain('streak_days');
    expect(Object.keys(body)).not.toContain('xp');

    const learnerProfile = schema('LearnerProfile') as { properties: Record<string, unknown> };
    expect(Object.keys(learnerProfile.properties)).not.toContain('streak_days');
    expect(Object.keys(learnerProfile.properties)).not.toContain('xp');
  });

  it('holds theta_estimates empty while the table holds 1.200 — the one member ADR-043 R1 owns', async () => {
    await seedEverything();

    const body = await profileOf(LEARNER);
    const row = await one<{ theta: string }>(
      `SELECT theta FROM theta_estimates WHERE learner_id = $1`,
      [LEARNER],
    );

    // The row exists and the member stays `{}` — by decision, not by omission. ADR-045 D6 holds
    // `theta_estimates` until ADR-043 R1 (H3) ratifies whether θ and its `se` leave the public API at
    // all, and `diagnostic-spec.md` §3.6's reportability lattice is consulted nowhere on this path.
    // This is the only assertion in this file that is a *hold* rather than a correction, and it is the
    // one H3's ratification inverts.
    expect(Number(row.theta)).toBeCloseTo(1.2, 3);
    expect(body.theta_estimates).toEqual({});
  });

  it('differs from a second learner by every member the tables differ by, and by nothing else', async () => {
    await seedEverything();

    const mine = await profileOf(LEARNER);
    const theirs = await profileOf(OTHER);

    // The positive half of the measurement, now with five members to tell apart: the seed wrote
    // `created_at`, a run, two mastery rows and an FSRS state for the first learner and nothing for
    // the second, so every derived member differs — and the one member that is the document's default
    // for everybody does not. A body that ignored the tables could not produce either half.
    expect(mine.learner_id).toBe(LEARNER);
    expect(theirs.learner_id).toBe(OTHER);
    expect(theirs.created_at).not.toBe(mine.created_at);
    expect(theirs.cefr_level).toBeNull();
    expect(theirs.mastery).toEqual({});
    expect(theirs.fsrs_states).toEqual({});
    expect(theirs.preferences).toEqual(mine.preferences);
  });
});

describe('A7 — the mastery response against the gate the domain computes', () => {
  it('answers gate_passed false for a skill whose five clauses all pass', async () => {
    await seedEverything();

    const body = await masteryOf(LEARNER);

    // The oracle first: ADR-018 §6.1's predicate, evaluated over the row the seed wrote. `gate_passed`
    // is not stored anywhere (ADR-018 §1) — it can only ever be a verdict, and this is the verdict the
    // evidence the learner actually has produces.
    const gate = new MasteryGateService().evaluate({
      pKnow: 0.93,
      nObs: 4,
      distinctDays: 3,
      spacedObs: 2,
      observations: [
        { skillId: 'grammar.articles', practicedAt: new Date(Date.now() - 24 * 3600 * 1000) },
        { skillId: 'grammar.articles', practicedAt: new Date(Date.now() - 48 * 3600 * 1000) },
      ],
      domain: 'grammar',
      now: new Date(),
    });

    expect(gate.clauses).toEqual({
      numeric: true,
      confidence: true,
      nObs: true,
      distinctDays: true,
      spacedObs: true,
    });
    expect(gate.passed).toBe(true);

    // The route answers a constant instead — and the same constant for the skill at 0.050, which is
    // the other half of the claim: `false` here is not a conservative answer, it is no answer.
    expect(body['grammar']).toMatchObject({ mastery: 0.5, gate_passed: false });
    expect(body['vocab']).toMatchObject({ mastery: 0.5, gate_passed: false });
  });

  it('names grammar and vocab whatever skills exist, because the keys are the whole answer', async () => {
    await seedEverything();

    const body = await masteryOf(LEARNER);
    const skills = (
      await sql<{ id: string }>(`SELECT id FROM skills ORDER BY id`)
    ).map((row) => row.id);

    expect(skills).toEqual(['grammar.articles', 'vocabulary.airport']);

    // The response schema is a bare `additionalProperties` map, so the *keys* are the entire content:
    // two skills written into the handler, and neither is a skill this learner has evidence for.
    expect(Object.keys(body).sort()).toEqual(['grammar', 'vocab']);
  });
});

describe('A7 — the placement response and the schema it publishes', () => {
  it('omits the member the published schema requires, and the document never defines it', async () => {
    const body = await place(LEARNER);

    const result = schema('PlacementResult') as { required: string[]; properties: Json };

    // Two defects, both readable from the document alone: `confidence` is required and undefined, so
    // the document is not self-consistent; and the served body does not carry it, so no response can
    // satisfy the schema it is documented by. `confidence` is declared by **no** spec of the six —
    // `grep -rn confidence specs/` returns the lesson id `les_rem_confidence_builder` and prose about
    // how a band is reported, never a member of this response — so the artifact is missing on both
    // sides, and the fix is a deletion, not an implementation.
    expect(result.required).toContain('confidence');
    expect(Object.keys(result.properties)).not.toContain('confidence');
    expect(result.required.filter((member) => !(member in body))).toEqual(['confidence']);
  });

  it('is the only schema in the document that requires a member it does not define', () => {
    // The same defect, measured over the whole document instead of at the one node it was found on:
    // `required` naming a member that `properties` does not declare is what makes a schema
    // unsatisfiable, and a schema is not the place to discover that a member has no source.
    const violations: string[] = [];

    const walk = (node: unknown, path: string): void => {
      if (Array.isArray(node)) {
        node.forEach((child, index) => walk(child, `${path}[${index}]`));
        return;
      }
      if (node === null || typeof node !== 'object') return;

      const holder = node as { required?: unknown; properties?: unknown };
      const declared =
        typeof holder.properties === 'object' && holder.properties !== null
          ? Object.keys(holder.properties)
          : [];
      if (Array.isArray(holder.required)) {
        for (const member of holder.required) {
          if (typeof member === 'string' && !declared.includes(member)) {
            violations.push(`${path}.${member}`);
          }
        }
      }
      for (const [key, child] of Object.entries(node)) walk(child, `${path}.${key}`);
    };

    walk(spec.components.schemas, 'schemas');
    expect(violations).toEqual(['schemas.PlacementResult.confidence']);
  });

  it('answers the member whose replacement the catalogue already has, and not the replacement', async () => {
    await seedEverything();

    const body = await place(LEARNER);
    const columns = (
      await sql<{ column_name: string }>(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'diagnostic_results'`,
      )
    ).map((row) => row.column_name);

    // ERD §6.1 (correction 15) deletes `blueprint_coverage` and names what replaces it: coverage is
    // a property of the *form*, so the column is `form_version`. The stored run has it; the response
    // answers `{}` under the deleted name, which is a number no measurement produced.
    expect(columns).toContain('form_version');
    expect(columns).not.toContain('blueprint_coverage');

    const run = await one<{ form_version: string }>(
      `SELECT form_version FROM diagnostic_results WHERE learner_id = $1`,
      [LEARNER],
    );
    expect(run.form_version).toBe('diagnostic_form_v1');

    expect(body['blueprint_coverage']).toEqual({});
    expect(body).not.toHaveProperty('form_version');
  });

  it('publishes a θ and a start node that the learner’s completed diagnostic contradicts', async () => {
    await seedEverything();

    const body = await place(LEARNER);
    const diagnostic = await one<{ theta: string; start_node: string }>(
      `SELECT theta, start_node FROM diagnostic_results WHERE learner_id = $1`,
      [LEARNER],
    );

    expect({ theta: Number(diagnostic.theta), start_node: diagnostic.start_node }).toEqual({
      theta: 1.9,
      start_node: 'les_c1_test',
    });

    // `diagnostic-spec.md` §3.6 defines this route's output — θ with its SE and CI, the recommended
    // start node, `skill_theta_reportable`. ADR-025 built the estimator that produces it. The route
    // answers neither the estimate nor the node, and answers the same two literals for every learner.
    expect(body.theta_estimate).toEqual({ theta: 0, se: 0.5, ci95: [-0.98, 0.98] });
    expect(body.start_node).toBe('les_a2_airport');
  });
});

describe('A7 — the practice response is not a function of the submission', () => {
  it('scores one fixed item of the catalogue, whichever item was submitted', async () => {
    const first = await practice(LEARNER, 'voc_airport_001');
    const second = await practice(LEARNER, 'grm_present_simple_003');

    // The one member that IS a function of the request — the echo A5b pinned — is the control inside
    // this test: the body varies with the submission in exactly this place and nowhere else.
    expect(second.pack_id).toBe(PACK);

    const expected = [
      {
        item_id: 'vocab.airport.001',
        correct: true,
        skill: 'vocab',
        bkt_update: { prior: 0.5, posterior: 0.8, transition: 'learned' },
      },
    ];
    expect(first.scored_items).toEqual(expected);
    // A different item, a different answer, and the same single scored result — still marked correct.
    expect(second.scored_items).toEqual(expected);
    expect(JSON.stringify(second)).not.toContain('grm_present_simple_003');
  });

  it('publishes a bkt_update whose two real columns are constants too, and a transition no column holds', async () => {
    await seedEverything();

    const body = await practice(LEARNER, 'voc_airport_001');
    const update = body.scored_items[0]?.['bkt_update'] as Json;

    const columns = (
      await sql<{ column_name: string }>(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'item_responses'`,
      )
    ).map((row) => row.column_name);

    // The two members that ARE columns — the control inside this test — and the row the seed wrote for
    // the same learner and the same item, with the seed's BKT update and a wrong answer.
    expect(columns).toContain('bkt_prior');
    expect(columns).toContain('bkt_posterior');

    const stored = await one<{ bkt_prior: string | number; bkt_posterior: string; correct: boolean }>(
      `SELECT bkt_prior, bkt_posterior, correct FROM item_responses WHERE learner_id = $1 AND item_id = 'vocab.airport.001'`,
      [LEARNER],
    );
    expect(Number(stored.bkt_prior)).toBeCloseTo(0.85, 3);
    expect(Number(stored.bkt_posterior)).toBeCloseTo(0.92, 3);
    expect(stored.correct).toBe(false);

    // So the two members that exist as columns are served as constants as well: 0.5/0.8, not the
    // 0.850/0.920 the row holds — and `learned`, a classification ADR-018 §9.7 removed from the schema
    // because it is defined in no spec and is a claim about *why* an answer was wrong, which a binary
    // outcome cannot carry. There is no column for it either.
    expect(update).toEqual({ prior: 0.5, posterior: 0.8, transition: 'learned' });
  });
});

describe('A7 — the next-activity response', () => {
  it('reports no mastery gaps while the learner has a skill at 0.050', async () => {
    await seedEverything();

    const body = await nextOf(LEARNER);

    const gaps = (
      await sql<{ skill_id: string }>(
        `SELECT skill_id FROM learner_mastery WHERE learner_id = $1 AND p_know < 0.85 ORDER BY skill_id`,
        [LEARNER],
      )
    ).map((row) => row.skill_id);

    // The contract declares `mastery_gaps` as *"Skill IDs where mastery < 0.85"*, and
    // `next-activity-selector.ts` rule 6 applies exactly that. The learner has one such skill; the
    // answer lists none, and calls the activity `prerequisite` with `i_plus_1: true` regardless.
    expect(gaps).toEqual(['vocabulary.airport']);
    expect(body.rationale).toMatchObject({
      mastery_gaps: [],
      selection_rule: 'prerequisite',
      i_plus_1: true,
    });
    expect(body.activity_id).toBe('les_a2_airport');
  });

  it('answers the A2 literal to a learner whose latest completed diagnostic is C1', async () => {
    await seedEverything();

    const body = await nextOf(LEARNER);
    const diagnostic = await one<{ cefr: string; start_node: string }>(
      `SELECT cefr, start_node FROM diagnostic_results WHERE learner_id = $1`,
      [LEARNER],
    );

    // `les_a2_airport` is the literal this handler was written with; the learner's latest completed
    // diagnostic is C1, whose own `start_node` is `les_c1_test`. The selection itself is blocked by
    // ADR-021 — the repository's only allowlisted red tests are `next-activity-selector.spec.ts`'s
    // five — so what is recorded here is the block, not a value that happens to be wrong.
    expect(diagnostic).toEqual({ cefr: 'C1', start_node: 'les_c1_test' });
    expect(body.activity_id).toBe('les_a2_airport');
  });
});
