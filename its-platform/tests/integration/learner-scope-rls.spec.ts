/**
 * A5b — the cross-learner 404 is the **policy's** answer, measured over HTTP (ADR-038 D3).
 *
 * `docs/api-spec.openapi.yaml` has published a `404` for the learner-scoped routes since before A5b
 * — and A0 measured that none of them read anything, so an unauthenticated caller was served the way
 * an authenticated one was and *any* id was answered. This file measures the claim D3 actually makes:
 * the 404 is not a decision taken in a handler, it is the **consequence** of ADR-003's
 * `learner_isolation` policy returning no row for the addressed id under the caller's own context.
 * There is no `if (pathId === tokenSubject)` anywhere on the path, and the two indistinguishable
 * cases below are why that shape was rejected: a nonexistent id and another learner's id must answer
 * the same bytes, or the route becomes an enumeration oracle (`CONSTITUTION.md` §4.4).
 *
 * **Why the role is set here, and what that means.** `learner_isolation` is `FOR ALL TO
 * its_platform_app`, and a table's **owner bypasses its own policies** unless `FORCE ROW LEVEL
 * SECURITY` is set — which no table in this schema sets. So every assertion about the policy is made
 * with the connection switched to `its_platform_app`, the role ADR-019/ADR-026 define for the process
 * and the same switch `rls-isolation.spec.ts` uses. The last `describe` measures what that means: with
 * the connection left as its owner the same request answers `200`, because nothing filtered the row.
 * That is not a hypothetical — `src/infrastructure/data-source.ts` builds the pool from
 * `DB_USERNAME` (default `postgres`) and no code in `src/` issues `SET ROLE` — and it is why
 * `reports/api/fase-5b.md` §4.2 records the connection role as an open item of this phase rather than
 * a detail of the test.
 *
 * **Both modes.** `createTestDb()` gives PGlite when `TEST_DATABASE_URL` is unset and a real
 * PostgreSQL 16 when it is set; the assertions are the same in both, and CI runs this file in the
 * real-engine job (`rls-integration`) because that is where a pooled connection, `SET ROLE` and a
 * warm connection are the real ones (ADR-014's narrowing, ADR-026 §5).
 *
 * The application is booted through `configureApp` — the composition root `main.ts` calls — so the
 * guard, the pipes and the error filter are the deployed ones, and the credential is a real RS256
 * token verified against a real JWKS (`tests/helpers/tokens.ts`). The `DataSource` is the harness's,
 * because a role is a property of the connection the application actually uses.
 */

import { Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';
import { DataSource } from 'typeorm';

import { configureApp } from '../../src/app.setup.js';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import { PgSessionContext } from '../../src/infrastructure/persistence/pg-session-context.js';
import { LearnerRepository } from '../../src/infrastructure/repositories/learner.repository.js';
import { LearnerScopeService } from '../../src/modules/learners/learner-scope.service.js';
import { LearnersController } from '../../src/modules/learners/learners.controller.js';
import { LearnersService } from '../../src/modules/learners/learners.service.js';
import { CurriculumController } from '../../src/modules/curriculum/curriculum.controller.js';
import { CurriculumService } from '../../src/modules/curriculum/curriculum.service.js';
import { PlacementController } from '../../src/modules/placement/placement.controller.js';
import { PlacementService } from '../../src/modules/placement/placement.service.js';
import { PracticeController } from '../../src/modules/practice/practice.controller.js';
import { PracticeService } from '../../src/modules/practice/practice.service.js';
import {
  authorization,
  clearOidcEnv,
  setOidcEnv,
  startTokenFixture,
  type TokenFixture,
} from '../helpers/tokens.js';

/** The caller. Owns a row, and is the `sub` of every token this file mints. */
const LEARNER_A = 'aaaaaaaa-aaaa-4111-8111-111111111111';
/** Another learner. Owns a row too — so a 404 about it cannot be explained by its absence. */
const LEARNER_B = 'bbbbbbbb-bbbb-4222-8222-222222222222';
/** Nobody. A well-formed uuid with no row, for the "the two cases are one answer" control. */
const ABSENT = 'cccccccc-cccc-4333-8333-333333333333';

const PROBLEM_MEDIA_TYPE = /^application\/problem\+json(; charset=utf-8)?$/;

/** A pack id and an item id the contract's patterns accept (measured against `PracticeSubmission`). */
const PACK_ID = 'pack_les_a2_airport_v1';
const ITEM_ID = 'voc_airport_001';

const placement = (learnerId: string) => ({ learner_id: learnerId, mode: 'adaptive' });
const practice = (learnerId: string) => ({
  learner_id: learnerId,
  pack_id: PACK_ID,
  responses: [{ item_id: ITEM_ID, response: 'gate', response_time_ms: 900 }],
});

/**
 * The four controllers that carry the five learner-scoped routes, with every layer between the
 * socket and the row real: the services, `LearnerScopeService`, `LearnerRepository`,
 * `PgSessionContext` — over the harness's `DataSource`, which is the only thing that had to be
 * supplied from outside (a role is a property of a connection).
 */
function moduleUnderTest(dataSource: DataSource): new () => unknown {
  @Module({
    controllers: [
      LearnersController,
      CurriculumController,
      PlacementController,
      PracticeController,
    ],
    providers: [
      LearnersService,
      CurriculumService,
      PlacementService,
      PracticeService,
      LearnerScopeService,
      LearnerRepository,
      PgSessionContext,
      // The token is the class: `LearnerRepository` and `PgSessionContext` both ask for `DataSource`.
      { provide: DataSource, useValue: dataSource },
    ],
  })
  class LearnerScopeHttpModule {}

  return LearnerScopeHttpModule;
}

/** The part of a `Problem` that must not depend on who asks (`request_id`/`instance` vary, §4.6). */
interface ProblemBody {
  type: unknown;
  title: unknown;
  status: unknown;
  detail?: unknown;
}

const comparable = (body: Record<string, unknown>) => ({
  type: body['type'],
  title: body['title'],
  status: body['status'],
  detail: body['detail'],
});

interface JsonProblem {
  status: number;
  detail?: string;
}

let testDb: TestDbContext;
let sessionContext: PgSessionContext;
let app: INestApplication;
let base = '';
let fixture: TokenFixture;
let AUTH: Record<string, string> = {};

/** Every request in this file is made with the caller's credential — the surface is authenticated. */
function call(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${base}${path}`, { ...init, headers: { ...AUTH, ...(init.headers ?? {}) } });
}

function post(path: string, body: unknown): Promise<Response> {
  return call(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Run `work` with the connection switched to the application role, and put it back afterwards. The
 * same shape `rls-isolation.spec.ts` uses: `SET ROLE` on the pooled connection, `RESET ROLE` in a
 * `finally`, so no test leaves the connection in another role.
 */
async function asApp<T>(work: () => Promise<T>): Promise<T> {
  await testDb.dataSource.query('SET ROLE its_platform_app');
  try {
    return await work();
  } finally {
    await testDb.dataSource.query('RESET ROLE');
  }
}

beforeAll(async () => {
  testDb = await createTestDb();
  sessionContext = new PgSessionContext(testDb.dataSource);

  // As the owner, before any role is switched: the policy's two rows must exist, or a 404 about
  // LEARNER_B would be indistinguishable from a fixture that never wrote anything.
  await testDb.dataSource.query(
    `INSERT INTO learners (id) VALUES ($1), ($2) ON CONFLICT (id) DO NOTHING`,
    [LEARNER_A, LEARNER_B],
  );

  fixture = await startTokenFixture();
  setOidcEnv(fixture);

  app = await NestFactory.create(
    moduleUnderTest(testDb.dataSource) as never,
    { logger: false },
  );
  configureApp(app);
  await app.listen(0);
  const { port } = app.getHttpServer().address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;

  AUTH = authorization(await fixture.accessToken(LEARNER_A, ['learner:self']));
});

afterAll(async () => {
  await app.close();
  clearOidcEnv();
  await fixture.close();
  await testDb.cleanup();
});

describe('A5b — the load that decides, as its_platform_app', () => {
  beforeEach(async () => {
    await testDb.dataSource.query(`SET ROLE its_platform_app`);
  });

  afterEach(async () => {
    await testDb.dataSource.query(`RESET ROLE`);
  });

  it('hands the connection to the application in the application role, not as its owner', async () => {
    // The mechanism made explicit, on the exact path the handler takes: `PgSessionContext` opens the
    // transaction on a query runner the pool hands it, and `SET ROLE` was issued on the pool. PGlite
    // has one connection, so this is exact there; on a pool it holds because the requests in this
    // file are serial and the connection is warm — the same assumption `rls-isolation.spec.ts` makes.
    const rows = await sessionContext.withLearner(LEARNER_A, (tx) =>
      tx.query('SELECT current_user AS who'),
    );

    expect(rows[0].who).toBe('its_platform_app');
  });

  it('answers the caller its own profile — the positive control the 404 is read against', async () => {
    const response = await call(`/api/v1/learners/${LEARNER_A}/profile`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ learner_id: LEARNER_A });
  });

  it("refuses another learner's profile with 404 and a Problem body", async () => {
    const response = await call(`/api/v1/learners/${LEARNER_B}/profile`);

    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
    const body = (await response.json()) as JsonProblem;
    expect(body.status).toBe(404);
    expect(body.detail).toBe('Learner not found');
  });

  it('answers an id that does not exist exactly as it answers another learner — no oracle', async () => {
    const foreign = await call(`/api/v1/learners/${LEARNER_B}/profile`);
    const absent = await call(`/api/v1/learners/${ABSENT}/profile`);

    // Both, before they are compared. A comparison of two answers is satisfied by any pair of equal
    // answers, and the negative control run for this file showed exactly that: with the load removed
    // this case passed while the five around it failed. It is a *sameness* assertion, so the pair has
    // to be pinned to the refusal first for it to mean anything.
    expect(foreign.status).toBe(404);
    expect(absent.status).toBe(404);
    expect(absent.status).toBe(foreign.status);
    // `request_id` and `instance` differ by design (§4.6); the members that carry meaning must not.
    expect(consequently(absent)).toEqual(consequently(foreign));
  });

  it("refuses another learner's mastery with 404", async () => {
    const own = await call(`/api/v1/learners/${LEARNER_A}/mastery`);
    const foreign = await call(`/api/v1/learners/${LEARNER_B}/mastery`);

    expect(own.status).toBe(200);
    expect(foreign.status).toBe(404);
  });

  it("refuses another learner's next activity with 404", async () => {
    const own = await call(`/api/v1/learners/${LEARNER_A}/next`);
    const foreign = await call(`/api/v1/learners/${LEARNER_B}/next`);

    expect(own.status).toBe(200);
    expect(foreign.status).toBe(404);
  });

  it("refuses a placement addressed to another learner, and runs the caller's own", async () => {
    const own = await post(`/api/v1/learners/${LEARNER_A}/placement`, placement(LEARNER_A));
    const foreign = await post(`/api/v1/learners/${LEARNER_B}/placement`, placement(LEARNER_B));

    expect(own.status).toBe(200);
    expect(foreign.status).toBe(404);
  });

  it("refuses a practice submission addressed to another learner, and scores the caller's own", async () => {
    const own = await post(`/api/v1/learners/${LEARNER_A}/practice`, practice(LEARNER_A));
    const foreign = await post(`/api/v1/learners/${LEARNER_B}/practice`, practice(LEARNER_B));

    expect(own.status).toBe(200);
    expect(foreign.status).toBe(404);
  });
});

/**
 * The door the deployment must keep shut.
 *
 * Nothing here is a claim about how the API *should* answer; it is a measurement of what the
 * application does when the connection is what `src/infrastructure/data-source.ts` builds by default
 * — the owner of the tables, which bypasses their policies. It is the negative control for the
 * describe above: it shows the 404 is produced by the policy and not by the handler, and therefore
 * that the connection role is a **precondition** of ADR-038 D3 rather than an implementation detail.
 *
 * `reports/api/fase-5b.md` §4.2 records it.
 */
describe('A5b — with the connection left as its owner, the same request is answered 200', () => {
  it("the row the 404 hid is present: another learner's id exists, and the 404 was not absence", async () => {
    const rows = await testDb.dataSource.query(`SELECT id FROM learners WHERE id = $1`, [LEARNER_B]);

    expect(rows).toHaveLength(1);
  });

  it("serves another learner's profile when no policy is in force — the role is what refuses", async () => {
    const response = await call(`/api/v1/learners/${LEARNER_B}/profile`);

    expect(response.status).toBe(200);
  });
});

function consequently(response: Response): Promise<Record<string, unknown>> {
  return response.json().then((body: unknown) => {
    const problem = body as ProblemBody;
    return {
      type: problem.type,
      title: problem.title,
      status: problem.status,
      detail: problem.detail,
    };
  });
}
