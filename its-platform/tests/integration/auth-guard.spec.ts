/**
 * A5b — the global guard, over real HTTP, against a real JWKS.
 *
 * Every claim in this file is a claim ADR-038 makes and a claim that a document cannot make for
 * us. `docs/api-spec.openapi.yaml` *declared* `security: [BearerAuth: []]` for the whole surface
 * before A5b — and A0 measured that the code had **zero** guards, so an unauthenticated request was
 * served the way an authenticated one was. The contract was not wrong about what it wanted; it was
 * simply unenforced, and nothing in the repository could see the difference. This suite sees it:
 * it boots the application through `configureApp` (the composition root `src/main.ts` also calls)
 * and asserts the bytes that come back on a socket.
 *
 * The four specs that already booted an application (`error-response`, `post-success-status`,
 * `request-validation`, `auth-refresh`) now have to present a credential — that is what this
 * change means, and their diffs are the evidence that it is not optional.
 *
 * The fixture in `tests/helpers/tokens.ts` is a real JWKS over loopback HTTP signed with a key
 * generated for the test, so the path exercised here is the production path: fetch the key set,
 * verify the signature, check `iss` / `aud` / `exp`, pin the algorithm. Only the key's owner
 * differs, and the suite's last case is the one that proves the difference is not a hole: an
 * application with **no** OIDC configuration refuses every protected route rather than serving it.
 */

import { Controller, Get, Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';

import { configureApp } from '../../src/app.setup.js';
import { HealthController } from '../../src/health/health.controller.js';
import { ContentController } from '../../src/modules/content/content.controller.js';
import { ContentService } from '../../src/modules/content/content.service.js';
import { LearnersController } from '../../src/modules/learners/learners.controller.js';
import { LearnersService } from '../../src/modules/learners/learners.service.js';
import { TOKEN_VERIFIER } from '../../src/modules/auth/tokens.js';
import { tokenVerifierFromEnv } from '../../src/infrastructure/auth/token-verifier-from-env.js';
import {
  authorization,
  clearOidcEnv,
  foreignKey,
  setOidcEnv,
  startTokenFixture,
  type TokenFixture,
} from '../helpers/tokens.js';

const UUID = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';

const PROBLEM_MEDIA_TYPE = /^application\/problem\+json(; charset=utf-8)?$/;

const contentStub = {
  getLesson: (id: string) => Promise.resolve(id === 'les_ok' ? { lesson_id: id } : null),
  getPack: () => Promise.resolve(null),
  getDialogue: () => Promise.resolve(null),
  getDialogueAudio: () => Promise.resolve(null),
};

const learnersStub = {
  getProfile: (subject: string, id: string) => Promise.resolve({ learner_id: id }),
  getMastery: (subject: string, id: string) => Promise.resolve({ learner_id: id }),
};

@Module({
  controllers: [HealthController, ContentController, LearnersController],
  providers: [
    { provide: ContentService, useValue: contentStub },
    { provide: LearnersService, useValue: learnersStub },
    {
      provide: TOKEN_VERIFIER,
      useFactory: () => tokenVerifierFromEnv(),
    },
  ],
})
class AuthContractModule {}

/** A second module, for the unconfigured case — one application, one environment. */
@Controller('probe')
class ProbeController {
  @Get()
  read(): { ok: true } {
    return { ok: true };
  }
}

@Module({
  controllers: [HealthController, ProbeController],
  providers: [
    {
      provide: TOKEN_VERIFIER,
      useFactory: () => tokenVerifierFromEnv(),
    },
  ],
})
class ProbeModule {}

async function boot(module: unknown): Promise<{ app: INestApplication; base: string }> {
  const app = await NestFactory.create(module as never, { logger: false });
  configureApp(app);
  await app.listen(0);
  const address = app.getHttpServer().address() as AddressInfo;
  return { app, base: `http://127.0.0.1:${address.port}` };
}

let fixture: TokenFixture;
let app: INestApplication;
let base = '';

beforeAll(async () => {
  fixture = await startTokenFixture();
  setOidcEnv(fixture);
  ({ app, base } = await boot(AuthContractModule));
});

afterAll(async () => {
  await app.close();
  clearOidcEnv();
  await fixture.close();
});

const call = (path: string, headers: Record<string, string> = {}): Promise<Response> =>
  fetch(`${base}${path}`, { headers });

describe('A5b — a difficulty-free surface is not a public surface (§4.5)', () => {
  it('answers an unauthenticated read of the catalogue with 401', async () => {
    const response = await call('/api/v1/content/lessons/les_ok');

    expect(response.status).toBe(401);
    expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });

  it('answers an unauthenticated read of a learner with 401 — and never with the learner’s body', async () => {
    const response = await call(`/api/v1/learners/${UUID}/profile`);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ status: 401 });
  });

  it('carries the correlated id on the 401, because the middleware runs before the guard (§4.6)', async () => {
    const response = await call('/api/v1/content/lessons/les_ok', { 'X-Correlation-ID': UUID });

    expect(response.headers.get('x-correlation-id')).toBe(UUID);
    await expect(response.json()).resolves.toMatchObject({ request_id: UUID });
  });
});

describe('A5b — the two probes stay reachable without a token (ADR-038 D1)', () => {
  it.each(['/health', '/ready'])('%s answers without a credential', async (path) => {
    const response = await call(path);

    expect(response.status).toBe(200);
  });
});

describe('A5b — a token that does not verify is a 401, in every way it can fail (§4.5)', () => {
  const cases: ReadonlyArray<[string, () => Promise<string>]> = [
    ['an unsigned token', async () => fixture.sign({ sub: UUID }, { unsigned: true })],
    ['a token signed by another key', async () => fixture.sign({ sub: UUID }, { key: await foreignKey() })],
    ['an expired token', async () => fixture.sign({ sub: UUID }, { expiresIn: -60 })],
    ['a token from another audience', async () => fixture.sign({ sub: UUID }, { audience: 'elsewhere' })],
    ['a token from another issuer', async () => fixture.sign({ sub: UUID }, { issuer: 'https://elsewhere.example' })],
    ['an HS256 token', async () => fixture.sign({ sub: UUID }, { algorithm: 'HS256' })],
    ['no token at all beyond the scheme', async () => 'Bearer'],
  ];

  it.each(cases)('refuses %s', async (_label, mint) => {
    const credential = await mint();
    const response = await call(
      '/api/v1/content/lessons/les_ok',
      credential === 'Bearer' ? { authorization: credential } : authorization(credential),
    );

    expect(response.status).toBe(401);
  });

  it('does not tell the caller which clause failed', async () => {
    const expired = await call('/api/v1/content/lessons/les_ok', authorization(await fixture.sign({ sub: UUID }, { expiresIn: -60 })));
    const forged = await call('/api/v1/content/lessons/les_ok', authorization(await fixture.sign({ sub: UUID }, { unsigned: true })));

    // Everything except the two members §4.6 makes per-occurrence: `instance` is the path and
    // `request_id` is the new correlation id, and those *must* differ. The members that describe
    // the refusal must not, or the response is the oracle the guard exists not to be.
    const invariant = (problem: Record<string, unknown>) => ({
      type: problem['type'],
      title: problem['title'],
      status: problem['status'],
      detail: problem['detail'],
    });

    const [live, expiredBody] = await Promise.all([
      forged.json() as Promise<Record<string, unknown>>,
      expired.json() as Promise<Record<string, unknown>>,
    ]);

    expect(invariant(live)).toEqual(invariant(expiredBody));
  });
});

describe('A5b — a valid token is authentication; the scope is authorisation (ADR-038 D2/D4)', () => {
  it('serves the catalogue to a token holding `content:read`', async () => {
    const token = await fixture.accessToken(UUID, ['content:read']);
    const response = await call('/api/v1/content/lessons/les_ok', authorization(token));

    expect(response.status).toBe(200);
  });

  it('refuses the catalogue to a token holding only `learner:self` — 403, per D4 row 1', async () => {
    const token = await fixture.accessToken(UUID, ['learner:self']);
    const response = await call('/api/v1/content/lessons/les_ok', authorization(token));

    expect(response.status).toBe(403);
    expect(response.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
  });

  it('refuses a learner route to a token holding only `content:read` — the case D4 names', async () => {
    const token = await fixture.accessToken(UUID, ['content:read']);
    const response = await call(`/api/v1/learners/${UUID}/profile`, authorization(token));

    expect(response.status).toBe(403);
  });

  it('refuses a token with no scope at all', async () => {
    const token = await fixture.accessToken(UUID);
    const response = await call(`/api/v1/learners/${UUID}/profile`, authorization(token));

    expect(response.status).toBe(403);
  });

  it('hands a sufficiently scoped request to the handler, and the handler answers', async () => {
    // The proof the guard let it through is the handler's own value: the stub answers the id it was
    // addressed with, so a body means the request reached the handler and a 200 means nothing
    // refused it on the way. Where a *refusal* comes from is D3's question, not the guard's, and it
    // is measured end-to-end (real policy, real rows) in `learner-scope-rls.spec.ts`.
    const token = await fixture.accessToken(UUID, ['learner:self']);
    const response = await call(`/api/v1/learners/${UUID}/profile`, authorization(token));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ learner_id: UUID });
  });
});

describe('A5b — an application with no OIDC configuration refuses everything (§4.5)', () => {
  let unconfigured: INestApplication;
  let unconfiguredBase = '';
  const saved = { ...process.env };

  beforeAll(async () => {
    clearOidcEnv();
    ({ app: unconfigured, base: unconfiguredBase } = await boot(ProbeModule));
  });

  afterAll(async () => {
    await unconfigured.close();
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('OIDC_')) delete process.env[key];
    }
    Object.assign(process.env, saved);
  });

  it('answers 401 rather than serving the route', async () => {
    const response = await fetch(`${unconfiguredBase}/api/v1/probe`);

    expect(response.status).toBe(401);
  });

  it('still lets the health probe through — the deficiency is not an outage', async () => {
    const response = await fetch(`${unconfiguredBase}/health`);

    expect(response.status).toBe(200);
  });
});
