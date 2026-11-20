/**
 * A5a — the success status the two `POST` operations serve, against the status the document
 * declares for them.
 *
 * `docs/api-spec.openapi.yaml` gives each operation a single success response, and for both of
 * these it is `200`: `POST /learners/{learner_id}/placement` and `POST /learners/{learner_id}/practice`
 * declare `'200'` and nothing else. Measured before A5a: **the server answered `201`** — NestJS's
 * default for `POST` — because `git log -S '@HttpCode'` over `src/` finds no commit that ever put a
 * status decorator on either method. Neither operation creates an addressable resource either (no
 * `Location` is returned, no resource id is minted: placement computes a band for a body the caller
 * already identified by path, and practice scores a submission), so the document's `200` is also the
 * defensible one and the code was the half that was wrong.
 *
 * The obligation this suite pins is the general one, not the incident: **the status the server sends
 * is a status the document declares for that operation.** The document is read here rather than
 * quoted, so a future `202`/`201` — in either direction, code or contract — makes this fail instead
 * of becoming the next silent disagreement between the two.
 *
 * The application is real — the controllers, their routes, the URL version and `configureApp` (the
 * composition root `src/main.ts` calls). The failure this guards against is only observable over
 * HTTP. Services are DB-free stubs: this suite measures response status, not persistence/RLS.
 */

import { readFileSync } from 'fs';
import type { INestApplication } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';
import { join } from 'path';
import * as yaml from 'yaml';

import { configureApp } from '../../src/app.setup.js';
import { TOKEN_VERIFIER } from '../../src/modules/auth/tokens.js';
import { tokenVerifierFromEnv } from '../../src/infrastructure/auth/token-verifier-from-env.js';
import { PlacementController } from '../../src/modules/placement/placement.controller.js';
import { PlacementService } from '../../src/modules/placement/placement.service.js';
import { PracticeController } from '../../src/modules/practice/practice.controller.js';
import { PracticeService } from '../../src/modules/practice/practice.service.js';
import { LearnerScopeService } from '../../src/modules/learners/learner-scope.service.js';
import {
  authorization,
  clearOidcEnv,
  setOidcEnv,
  startTokenFixture,
  type TokenFixture,
} from '../helpers/tokens.js';

const UUID = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
const PLACEMENT_PATH = '/learners/{learner_id}/placement';
const PRACTICE_PATH = '/learners/{learner_id}/practice';
const PLACEMENT = `/api/v1/learners/${UUID}/placement`;
const PRACTICE = `/api/v1/learners/${UUID}/practice`;

/** A real item id from the canonical airport pack. */
const ITEM_ID = 'grm_airport_immigration_questions_001';
const PACK_ID = 'pack_les_a2_airport_v1';

const spec = yaml.parse(
  readFileSync(join(process.cwd(), 'docs', 'api-spec.openapi.yaml'), 'utf8'),
) as {
  paths: Record<string, Record<string, { responses: Record<string, unknown> }>>;
};

/** The statuses the document declares as successes for one operation, in file order. */
function declaredSuccessStatuses(path: string): string[] {
  return Object.keys(spec.paths[path]?.['post']?.responses ?? {}).filter((s) => /^2\d\d$/.test(s));
}

const learnerScopeStub = {
  requireVisible: (_subject: string, id: string) => Promise.resolve({ id }),
  withVisible: <T>(
    _subject: string,
    id: string,
    work: (learner: { id: string }, tx: unknown) => Promise<T>,
  ) => work({ id }, {}),
};

const placementStub = {
  runDiagnostic: (_subject: string, id: string) =>
    Promise.resolve({
      learner_id: id,
      start_node: 'les_a2_airport',
      theta_estimate: { theta: 0.0, se: 0.5, ci95: [-0.98, 0.98] },
      blueprint_coverage: {},
      stopping_rule: 'fixed_form',
    }),
};

const practiceStub = {
  submitPractice: (_subject: string, _id: string, body: { pack_id: string }) =>
    Promise.resolve({
      pack_id: body.pack_id,
      scored_items: [],
      mastery_updates: [],
      next_review_schedule: [],
    }),
};

@Module({
  controllers: [PlacementController, PracticeController],
  providers: [
    { provide: PlacementService, useValue: placementStub },
    { provide: PracticeService, useValue: practiceStub },
    { provide: LearnerScopeService, useValue: learnerScopeStub },
    {
      provide: TOKEN_VERIFIER,
      useFactory: () => tokenVerifierFromEnv(),
    },
  ],
})
class PostStatusModule {}

let app: INestApplication;
let base = '';
let fixture: TokenFixture;
let AUTH: Record<string, string> = {};

beforeAll(async () => {
  fixture = await startTokenFixture();
  setOidcEnv(fixture);
  app = await NestFactory.create(PostStatusModule, { logger: false });
  configureApp(app);
  await app.listen(0);
  base = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}`;
  AUTH = authorization(await fixture.accessToken(UUID, ['learner:self']));
});

afterAll(async () => {
  await app?.close();
  clearOidcEnv();
  await fixture.close();
});

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...AUTH },
    body: JSON.stringify(body),
  });
}

const validPlacement = { learner_id: UUID, mode: 'fixed' as const };

const validSubmission = {
  learner_id: UUID,
  pack_id: PACK_ID,
  responses: [{ item_id: ITEM_ID, response: 'B', response_time_ms: 4200 }],
};

describe('A5a — each `POST` answers a status the document declares', () => {
  it('the document declares exactly one success status per operation, and it is 200', () => {
    expect(declaredSuccessStatuses(PLACEMENT_PATH)).toEqual(['200']);
    expect(declaredSuccessStatuses(PRACTICE_PATH)).toEqual(['200']);
  });

  it('`POST …/placement` answers 200 — not NestJS’s default 201 for POST', async () => {
    const res = await post(PLACEMENT, validPlacement);
    expect(res.status).toBe(200);
    expect(declaredSuccessStatuses(PLACEMENT_PATH)).toContain(String(res.status));
  });

  it('`POST /learners/{learner_id}/practice` answers 200 for the same reason', async () => {
    const res = await post(PRACTICE, validSubmission);
    expect(res.status).toBe(200);
    expect(declaredSuccessStatuses(PRACTICE_PATH)).toContain(String(res.status));
  });
});
