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
 * of becoming the next silent disagreement between the two. `npm run contract:gate` covers
 * *presence* of routes, error media types and the request-body rules; it does not compare a served
 * success status against the declared set, and until A5a nothing did.
 *
 * The application is real — the controllers, their routes, the URL version and `configureApp` (the
 * composition root `src/main.ts` calls). The failure this guards against is only observable over
 * HTTP: the decorator is metadata on a route, and a unit test of the controller method would assert
 * the return value while the framework decided the status.
 */

import { readFileSync } from 'fs';
import type { INestApplication } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';
import { join } from 'path';
import * as yaml from 'yaml';

import { configureApp } from '../../src/app.setup.js';
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

const UUID = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
const PLACEMENT_PATH = '/learners/{learner_id}/placement';
const PRACTICE_PATH = '/learners/{learner_id}/practice';
const PLACEMENT = `/api/v1/learners/${UUID}/placement`;
const PRACTICE = `/api/v1/learners/${UUID}/practice`;

/** A real item id from the catalogue — measured: all 49 distinct pack item ids match the pattern. */
const ITEM_ID = 'voc_email_tone_marker_001';

const spec = yaml.parse(
  readFileSync(join(process.cwd(), 'docs', 'api-spec.openapi.yaml'), 'utf8'),
) as {
  paths: Record<string, Record<string, { responses: Record<string, unknown> }>>;
};

/** The statuses the document declares as successes for one operation, in file order. */
function declaredSuccessStatuses(path: string): string[] {
  return Object.keys(spec.paths[path]?.['post']?.responses ?? {}).filter((s) => /^2\d\d$/.test(s));
}

@Module({
  controllers: [PlacementController, PracticeController],
  providers: [PlacementService, PracticeService],
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
  // A5b: both operations are learner-scoped and authenticated, so the suite now presents the
  // credential a real caller would. What it asserts is unchanged — the *status* of a request that
  // was already going to succeed; before the fixture, it was asserted of a request the guard would
  // have refused, which is how the 201 survived A5a's proof.
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
  pack_id: 'pack_les_a2_email_basics_v1',
  responses: [{ item_id: ITEM_ID, response: 'B', response_time_ms: 4200 }],
};

describe('A5a — each `POST` answers a status the document declares', () => {
  it('the document declares exactly one success status per operation, and it is 200', () => {
    // The premise of the two cases below, read from the file rather than restated: if the document
    // ever gains a second success status, this case is where that shows up.
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
