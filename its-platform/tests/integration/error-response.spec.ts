/**
 * P1.17 — what the running application actually answers, over real HTTP.
 *
 * Every other error assertion in this repository reads a document: `npm run contract:gate` checks
 * that `docs/api-spec.openapi.yaml` declares `application/problem+json` + `Problem` for all 14
 * 4xx/5xx responses, and `tests/contract/schemas.spec.ts` validates success payloads against their
 * schemas. Neither can see the difference between "the document says Problem" and "the server sends
 * Problem" — and for the whole life of this API the two disagreed (the filter sent
 * `application/json` with `type: https://httpstatuses.com/{status}` until A4).
 *
 * So this suite boots a real Nest application through `configureApp` — the same composition root
 * `src/main.ts` calls — and asserts the bytes on the wire. The controllers are the real ones
 * (`ContentController`, `LearnersController`), reached through their real routes, URL version and
 * pipes; only their *services* are stubbed, because the artifact under test is the error pipeline,
 * not the repository behind it (that is `content-api.spec.ts` / `content-audio.spec.ts`, over
 * PGlite).
 *
 * What it establishes, and against which rule:
 *
 * | assertion | rule |
 * |---|---|
 * | media type, the six members, no `error`/`message` | §4.3 + the canonical `Problem` schema |
 * | `X-Correlation-ID` on success **and** error responses, `request_id` = that id | §4.6 |
 * | a non-UUID inbound id is replaced, not echoed | §4.6 (injection-safe logs) + `format: uuid` |
 * | 500 body carries no internal message; the message reaches the log with the id | §4.3 |
 * | the API answers under `/api/v1` and not at the root | §4.4 (control N-19 in the gate) |
 */

import { Body, Controller, Get, Logger, Module, NotFoundException, Post } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IsString } from 'class-validator';
import type { AddressInfo } from 'net';

import { configureApp } from '../../src/app.setup.js';
import { TOKEN_VERIFIER } from '../../src/modules/auth/tokens.js';
import { tokenVerifierFromEnv } from '../../src/infrastructure/auth/token-verifier-from-env.js';
import { ContentController } from '../../src/modules/content/content.controller.js';
import { ContentService } from '../../src/modules/content/content.service.js';
import { LearnersController } from '../../src/modules/learners/learners.controller.js';
import { LearnersService } from '../../src/modules/learners/learners.service.js';
import { LearnerScopeService } from '../../src/modules/learners/learner-scope.service.js';
import { LearnerProfileRepository } from '../../src/infrastructure/repositories/learner-profile.repository.js';
import { LearnerContextError } from '../../src/infrastructure/persistence/pg-session-context.js';
import {
  authorization,
  clearOidcEnv,
  setOidcEnv,
  startTokenFixture,
  type TokenFixture,
} from '../helpers/tokens.js';

/** The internal text a domain error really carries (`PgSessionContext.withLearner`). */
const INTERNALS =
  'withLearner requires a non-blank learnerId; a blank id must never be written into ' +
  'app.current_learner_id';

const UUID = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
const PROBLEM_MEMBERS = ['detail', 'instance', 'request_id', 'status', 'title', 'type'];

class ProbeDto {
  @IsString()
  name!: string;
}

/**
 * Two error sources the four published reads cannot produce without a database: an unhandled
 * exception carrying internals, and a body that fails `ValidationPipe`. The controller is
 * test-only and lives in `tests/`, so the contract gate (which scans `src/`) never sees its routes.
 */
@Controller('probe')
class ProbeController {
  @Get('boom')
  boom(): never {
    throw new LearnerContextError(INTERNALS);
  }

  @Post('echo')
  echo(@Body() _body: ProbeDto): { ok: true } {
    return { ok: true };
  }
}

const contentStub = {
  getLesson: (id: string) => Promise.resolve(id === 'les_ok' ? { lesson_id: id } : null),
  getPack: () => Promise.resolve(null),
  getDialogue: () => Promise.resolve(null),
  getDialogueAudio: () => Promise.resolve(null),
};

/**
 * The learner route's 404 as A5b produces it: `LearnerScopeService` refuses before the payload is
 * built, and the filter renders the refusal. The service under it is the **real** one, so this file
 * exercises the same three layers the request does (`controller → service → scope`), with the
 * database — the one layer a contract suite should not need — replaced by the refusal itself.
 * The refusal measured against a real policy over HTTP is `learner-scope-rls.spec.ts`.
 *
 * Both ways of asking refuse here, because both are the same refusal: A7b's `withVisible` is what
 * `GET …/profile` now asks, and it rejects before the work — so the stub refuses without ever
 * calling it, exactly as the real one does.
 */
const learnerScopeStub = {
  requireVisible: () => Promise.reject(new NotFoundException('Learner not found')),
  withVisible: () => Promise.reject(new NotFoundException('Learner not found')),
};

/**
 * A7b gave `LearnersService` one more collaborator, and it is stubbed for the same reason the scope
 * service is: every request this file sends is refused by the scope before a member is read, so the
 * repository is never asked anything. Its stub never answers a call — an empty read would be the
 * honest answer, but the suite would be asserting the shape of a payload it does not publish.
 */
const learnerProfileStub = {
  read: () => {
    throw new Error('the profile repository is unreachable in this suite: the scope refuses first');
  },
};

@Module({
  controllers: [ContentController, LearnersController, ProbeController],
  providers: [
    { provide: ContentService, useValue: contentStub },
    LearnersService,
    { provide: LearnerScopeService, useValue: learnerScopeStub },
    { provide: LearnerProfileRepository, useValue: learnerProfileStub },
    {
      provide: TOKEN_VERIFIER,
      useFactory: () => tokenVerifierFromEnv(),
    },
  ],
})
class ErrorContractModule {}

let app: INestApplication;
let base = '';
let fixture: TokenFixture;
const loggedErrors: Array<{ message: unknown; stack?: unknown }> = [];

/**
 * A5b put the guard in front of everything this file reaches, so the suite now presents one
 * credential for all of it. It holds both scopes because the file spans both surfaces (`/content`
 * and `/learners`) — a property of this arrangement, not of the scopes.
 */
let AUTH: Record<string, string> = {};

/** The media type §4.3 makes mandatory; Express may append the charset. */
const PROBLEM_MEDIA_TYPE = /^application\/problem\+json(; charset=utf-8)?$/;

beforeAll(async () => {
  jest.spyOn(Logger.prototype, 'error').mockImplementation((message: unknown, stack?: unknown) => {
    loggedErrors.push({ message, stack });
  });

  fixture = await startTokenFixture();
  setOidcEnv(fixture);

  app = await NestFactory.create(ErrorContractModule, { logger: false });
  configureApp(app);
  await app.listen(0);
  const address = app.getHttpServer().address() as AddressInfo;
  base = `http://127.0.0.1:${address.port}`;

  AUTH = authorization(await fixture.accessToken(UUID, ['learner:self', 'content:read']));
});

afterAll(async () => {
  jest.restoreAllMocks();
  await app?.close();
  clearOidcEnv();
  await fixture.close();
});

async function get(path: string, headers: Record<string, string> = {}): Promise<Response> {
  return fetch(`${base}${path}`, { headers: { ...AUTH, ...headers } });
}

async function problemOf(res: Response): Promise<Record<string, unknown>> {
  return (await res.json()) as Record<string, unknown>;
}

describe('P1.17 — the served error response is the contract’s `Problem`', () => {
  it('404 from a real route: problem+json media type, six members, no `error`/`message`', async () => {
    const res = await get('/api/v1/content/lessons/nope');
    const problem = await problemOf(res);

    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
    expect(res.headers.get('content-type')).not.toContain('application/json');
    expect(Object.keys(problem).sort()).toEqual(PROBLEM_MEMBERS.slice().sort());
    expect(problem).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Lesson not found',
      instance: '/api/v1/content/lessons/nope',
    });
  });

  it('400 from a malformed path parameter, with the occurrence’s message in `detail`', async () => {
    const res = await get('/api/v1/content/listening/!!!/audio');
    const problem = await problemOf(res);

    expect(res.status).toBe(400);
    expect(res.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
    expect(problem).toMatchObject({
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Malformed dialogue_id',
      instance: '/api/v1/content/listening/!!!/audio',
    });
  });

  it('400 from an unsupported rate: same title, its own detail', async () => {
    const res = await get('/api/v1/content/listening/dlg_a1_hello/audio?rate=2');
    const problem = await problemOf(res);

    expect(res.status).toBe(400);
    expect(problem['title']).toBe('Bad Request');
    expect(problem['detail']).toBe('Unsupported rate; expected 1 or 0.75');
  });

  it('404 from `learners/{id}/profile` — the hand-rolled body is gone', async () => {
    // A5b moved this refusal out of the controller and into `LearnerScopeService` (ADR-038 D3); what
    // this suite still owns is that whatever raises it, the bytes are the contract's `Problem`.
    const res = await get(`/api/v1/learners/${UUID}/profile`);
    const problem = await problemOf(res);

    expect(res.status).toBe(404);
    expect(problem).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Learner not found',
    });
    expect(problem).not.toHaveProperty('error');
    expect(problem).not.toHaveProperty('message');
  });

  it('400 from `ParseUUIDPipe` — `detail` is a string, which is what the schema declares', async () => {
    const res = await get('/api/v1/learners/not-a-uuid/profile');
    const problem = await problemOf(res);

    expect(res.status).toBe(400);
    expect(typeof problem['detail']).toBe('string');
    expect(String(problem['detail'])).toMatch(/uuid/i);
  });

  it('404 from an unknown route — the framework’s own exception, rendered the same', async () => {
    const res = await get('/api/v1/does-not-exist');
    const problem = await problemOf(res);

    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
    expect(problem).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Cannot GET /api/v1/does-not-exist',
    });
  });

  it('400 from `ValidationPipe`: the message array is joined into one string', async () => {
    const res = await fetch(`${base}/api/v1/probe/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...AUTH },
      body: JSON.stringify({ name: 'ok', notWhitelisted: 1 }),
    });
    const problem = await problemOf(res);

    expect(res.status).toBe(400);
    expect(typeof problem['detail']).toBe('string');
    expect(String(problem['detail'])).toMatch(/notWhitelisted/);
    // Per-field structure (`errors[]`) is ADR-034 D5 — `Proposed`, and blocked on the canonical
    // `type` domain (reports/api/fase-4.md §8). Nothing invents it here; this is the receipt.
    expect(problem).not.toHaveProperty('errors');
  });

  it('serves `/api/v1` and nothing at the root (§4.4)', async () => {
    const prefixed = await get('/api/v1/content/lessons/les_ok');
    const unprefixed = await get('/content/lessons/les_ok');

    expect(prefixed.status).toBe(200);
    expect(unprefixed.status).toBe(404);
  });
});

describe('P1.17 — the correlation id (§4.6)', () => {
  it('is on every response, success and error alike, and equals `request_id`', async () => {
    const ok = await get('/api/v1/content/lessons/les_ok');
    const onSuccess = ok.headers.get('x-correlation-id');
    expect(onSuccess).toMatch(/^[0-9a-f-]{36}$/);

    const res = await get('/api/v1/content/lessons/nope');
    const problem = await problemOf(res);
    expect(res.headers.get('x-correlation-id')).toBe(problem['request_id']);
  });

  it('adopts a UUID the caller supplied', async () => {
    const res = await get('/api/v1/content/lessons/nope', { 'X-Correlation-ID': UUID });
    const problem = await problemOf(res);

    expect(res.headers.get('x-correlation-id')).toBe(UUID);
    expect(problem['request_id']).toBe(UUID);
  });

  it('replaces a value that is not a UUID instead of echoing it', async () => {
    const res = await get('/api/v1/content/lessons/nope', { 'X-Correlation-ID': 'trace-me-please' });
    const problem = await problemOf(res);
    const echoed = res.headers.get('x-correlation-id');

    expect(echoed).not.toBe('trace-me-please');
    expect(echoed).toBe(problem['request_id']);
  });

  it('issues a distinct id per request — two errors in a row do not share one', async () => {
    const first = await get('/api/v1/content/lessons/nope');
    const second = await get('/api/v1/content/lessons/nope');

    expect(first.headers.get('x-correlation-id')).not.toBeNull();
    expect(first.headers.get('x-correlation-id')).not.toBe(second.headers.get('x-correlation-id'));
  });
});

describe('P1.17 — §4.3: the response never carries what the log does', () => {
  it('answers 500 as a bare Problem, and logs the internal message with the id', async () => {
    loggedErrors.length = 0;
    const res = await get('/api/v1/probe/boom', { 'X-Correlation-ID': UUID });
    const problem = await problemOf(res);

    expect(res.status).toBe(500);
    expect(res.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
    expect(problem).toMatchObject({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      instance: '/api/v1/probe/boom',
      request_id: UUID,
    });
    expect(problem).not.toHaveProperty('detail');

    const serialised = JSON.stringify(problem);
    for (const needle of ['current_learner_id', 'LearnerContextError', 'withLearner']) {
      expect(serialised).not.toContain(needle);
    }

    // Not discarded — routed to where internals belong.
    expect(loggedErrors).toHaveLength(1);
    expect(String(loggedErrors[0]?.message)).toContain(UUID);
    expect(String(loggedErrors[0]?.message)).toContain('GET /api/v1/probe/boom');
    expect(String(loggedErrors[0]?.stack)).toContain('current_learner_id');
  });
});
