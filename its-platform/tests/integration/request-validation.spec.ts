/**
 * A5a — what the two published request bodies accept, over real HTTP.
 *
 * `docs/api-spec.openapi.yaml` declares a body for exactly two operations:
 * `DiagnosticRequest` on `POST /learners/{learner_id}/placement` and `PracticeSubmission` on
 * `POST /learners/{learner_id}/practice`. Both schemas state `required`, `enum`, `format: uuid`,
 * `pattern`, `minimum`, `maximum`, `minItems` and a `oneOf` branch, and `CONSTITUTION.md` §4.5 makes
 * the enforcement mandatory: a global `ValidationPipe` with `whitelist` and
 * `forbidNonWhitelisted`, so that "non-whitelisted properties are rejected" and no request can
 * reach a service carrying members the contract never declared.
 *
 * Neither was true. Both controllers took `@Body() body: any`, so the pipe had no metatype to
 * validate against: **every** body was accepted — `{}` included, and a body carrying any member a
 * caller liked. This suite is the measurement of that gap and the evidence that it is closed; the
 * same assertions fail against the previous revision with `200` where they now require `400`
 * (recorded in `reports/api/fase-5.md`).
 *
 * The application is real: the controllers, their routes, the URL version, `configureApp` (the
 * composition root `src/main.ts` calls) and the error pipeline A4a delivered. Only the two services
 * are the real ones — they are DB-free stubs, and the artifact under test is the edge, not the
 * repository behind it.
 *
 * | assertion | authority |
 * |---|---|
 * | a declared member missing, or an undeclared one present, is 400 | `CONSTITUTION.md` §4.5; `required` + `additionalProperties` |
 * | the 400 is `application/problem+json` with the offending member named in `detail` | §4.3 + A4a's `ProblemExceptionFilter` |
 * | `enum`/`format: uuid`/`pattern`/`minimum`/`maximum`/`minItems` reject their violations | the request schemas, verbatim |
 * | `responses[].response` accepts both `oneOf` branches — a string and its object form | `PracticeSubmission.responses[].response` |
 * | the object branch of that `oneOf` rejects an undeclared member | §4.5 — `whitelist` cannot reach inside a union, so the DTO does |
 *
 * An accepted body is asserted as "not an error" (`< 400`), not as a particular 2xx: **which**
 * success status each operation answers is pinned against the document in
 * `post-success-status.spec.ts`, so this suite stays about what is refused.
 */

import { Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';

import { configureApp } from '../../src/app.setup.js';
import { PlacementController } from '../../src/modules/placement/placement.controller.js';
import { PlacementService } from '../../src/modules/placement/placement.service.js';
import { PracticeController } from '../../src/modules/practice/practice.controller.js';
import { PracticeService } from '../../src/modules/practice/practice.service.js';

const UUID = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
const PLACEMENT = `/api/v1/learners/${UUID}/placement`;
const PRACTICE = `/api/v1/learners/${UUID}/practice`;

/** §4.3's mandatory media type; Express may append the charset. */
const PROBLEM_MEDIA_TYPE = /^application\/problem\+json(; charset=utf-8)?$/;

/** A real item id from the catalogue — measured: all 49 distinct pack item ids match the pattern. */
const ITEM_ID = 'voc_email_tone_marker_001';

@Module({
  controllers: [PlacementController, PracticeController],
  providers: [PlacementService, PracticeService],
})
class RequestValidationModule {}

let app: INestApplication;
let base = '';

beforeAll(async () => {
  app = await NestFactory.create(RequestValidationModule, { logger: false });
  configureApp(app);
  await app.listen(0);
  base = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}`;
});

afterAll(async () => {
  await app?.close();
});

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** The `detail` A4a's filter builds from a `ValidationPipe` occurrence (messages joined by `'; '`). */
async function rejectedWith(
  pending: Response | Promise<Response>,
  needle: string,
): Promise<void> {
  const res = await pending;
  const problem = (await res.json()) as { detail?: string };
  expect(res.status).toBe(400);
  expect(res.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  expect(problem.detail).toContain(needle);
}

const validPlacement = { learner_id: UUID, mode: 'fixed' };

const validSubmission = {
  learner_id: UUID,
  pack_id: 'pack_les_a2_email_basics_v1',
  responses: [{ item_id: ITEM_ID, response: 'B', response_time_ms: 4200 }],
};

describe('A5a — `DiagnosticRequest` (`POST /learners/{learner_id}/placement`)', () => {
  it('accepts the body the contract publishes', async () => {
    const res = await post(PLACEMENT, validPlacement);
    expect(res.status).toBeLessThan(400);
  });
  it('accepts the optional `prior_estimate` object and each of its three members', async () => {
    const res = await post(PLACEMENT, {
      ...validPlacement,
      prior_estimate: { theta: -0.4, se: 0.6, source: 'self_report' },
    });
    expect(res.status).toBeLessThan(400);
  });

  it('rejects an empty body: both required members are named', async () => {
    const res = await post(PLACEMENT, {});
    const problem = (await res.json()) as { detail?: string };
    expect(res.status).toBe(400);
    expect(problem.detail).toContain('learner_id');
    expect(problem.detail).toContain('mode');
  });

  it('rejects a member the schema does not declare (`forbidNonWhitelisted`, §4.5)', async () => {
    await rejectedWith(await post(PLACEMENT, { ...validPlacement, debug: true }), 'debug');
  });

  it('rejects a `mode` outside the enum', async () => {
    await rejectedWith(post(PLACEMENT, { ...validPlacement, mode: 'irt' }), 'mode');
  });

  it('rejects a `learner_id` that is not a uuid (`format: uuid`)', async () => {
    await rejectedWith(post(PLACEMENT, { ...validPlacement, learner_id: 'learner-1' }), 'learner_id');
  });

  it('rejects a non-numeric `prior_estimate.theta`', async () => {
    await rejectedWith(
      post(PLACEMENT, { ...validPlacement, prior_estimate: { theta: 'zero' } }),
      'theta',
    );
  });

  it('rejects an undeclared `prior_estimate.source` (enum)', async () => {
    await rejectedWith(
      post(PLACEMENT, { ...validPlacement, prior_estimate: { source: 'guess' } }),
      'source',
    );
  });

  it('rejects an undeclared member *inside* `prior_estimate` — the nested object is whitelisted too', async () => {
    await rejectedWith(
      post(PLACEMENT, { ...validPlacement, prior_estimate: { theta: 1, debug: true } }),
      'debug',
    );
  });

  it('answers 400, never 500, when the body is not a JSON object', async () => {
    const res = await post(PLACEMENT, [1, 2, 3]);
    expect(res.status).toBe(400);
    expect(res.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });
});

describe('A5a — `PracticeSubmission` (`POST /learners/{learner_id}/practice`)', () => {
  it('accepts the body the contract publishes', async () => {
    const res = await post(PRACTICE, validSubmission);
    expect(res.status).toBeLessThan(400);
  });

  it('answers with the pack the caller submitted, not a fallback', async () => {
    const res = await post(PRACTICE, validSubmission);
    expect(await res.json()).toMatchObject({ pack_id: 'pack_les_a2_email_basics_v1' });
  });

  it('rejects a missing `responses`', async () => {
    const { responses, ...withoutResponses } = validSubmission;
    await rejectedWith(post(PRACTICE, withoutResponses), 'responses');
  });

  it('rejects a valid body carrying an undeclared top-level member', async () => {
    await rejectedWith(post(PRACTICE, { ...validSubmission, debug: true }), 'debug');
  });

  it('rejects a `pack_id` outside the published pattern', async () => {
    await rejectedWith(
      post(PRACTICE, { ...validSubmission, pack_id: 'lesson-a2-email' }),
      'pack_id',
    );
  });

  it('rejects zero responses (`minItems: 1`)', async () => {
    await rejectedWith(post(PRACTICE, { ...validSubmission, responses: [] }), 'responses');
  });

  it('rejects an `item_id` outside the published pattern', async () => {
    await rejectedWith(
      post(PRACTICE, {
        ...validSubmission,
        responses: [{ item_id: 'airport.001', response: 'B', response_time_ms: 10 }],
      }),
      'item_id',
    );
  });

  it('accepts an `item_id` in the catalogue’s form', async () => {
    const res = await post(PRACTICE, validSubmission);
    expect(res.status).toBeLessThan(400);
  });

  it('rejects a negative `response_time_ms` (`minimum: 0`)', async () => {
    await rejectedWith(
      post(PRACTICE, {
        ...validSubmission,
        responses: [{ item_id: ITEM_ID, response: 'B', response_time_ms: -1 }],
      }),
      'response_time_ms',
    );
  });

  it('rejects a `confidence` above 1 (`maximum: 1`)', async () => {
    await rejectedWith(
      post(PRACTICE, {
        ...validSubmission,
        responses: [{ item_id: ITEM_ID, response: 'B', response_time_ms: 10, confidence: 1.5 }],
      }),
      'confidence',
    );
  });

  it('accepts the object branch of `response` (`oneOf`)', async () => {
    const res = await post(PRACTICE, {
      ...validSubmission,
      responses: [
        {
          item_id: ITEM_ID,
          response: { transcript: 'I would like to book a room' },
          response_time_ms: 9000,
        },
      ],
    });
    expect(res.status).toBeLessThan(400);
  });

  it('rejects an undeclared member inside the object branch of `response`', async () => {
    await rejectedWith(
      post(PRACTICE, {
        ...validSubmission,
        responses: [
          { item_id: ITEM_ID, response: { transcript: 'x', debug: true }, response_time_ms: 10 },
        ],
      }),
      'debug',
    );
  });

  it('rejects a non-string `transcript`', async () => {
    await rejectedWith(
      post(PRACTICE, {
        ...validSubmission,
        responses: [
          { item_id: ITEM_ID, response: { transcript: 5 }, response_time_ms: 10 },
        ],
      }),
      'transcript',
    );
  });

  it('rejects a member inside an item that the item schema does not declare', async () => {
    await rejectedWith(
      post(PRACTICE, {
        ...validSubmission,
        responses: [{ item_id: ITEM_ID, response: 'B', response_time_ms: 10, debug: true }],
      }),
      'debug',
    );
  });
});
