/**
 * A5a — `POST /auth/refresh` answers `501`, as three documents already said it did.
 *
 * The operation is **out of MVP scope**: `CONSTITUTION.md` §4.5 makes the API a Resource Server
 * that *"does not issue tokens"* and puts `/auth/refresh` explicitly outside the MVP. The canonical
 * contract agrees twice over — the path carries `x-mvp-scope: excluded` + `x-blocked-by: ADR-013`,
 * its `501` response reads *"Not implemented. The MVP is a Resource Server and does not issue
 * tokens"*, and its description says *"Do not implement"*. `CHANGELOG.md` records the migration as
 * *"Returns `501`"*; `docs/security-audit.md` V2.2.1 asserts the same; `docs/api/inventario.md`
 * logged the gap in A0 (*"`/auth/refresh` devolve token mock onde o CHANGELOG manda `501`"*).
 *
 * Only the code disagreed. `AuthService.refreshToken()` minted `mock_access_token` with
 * `expires_in: 900` and the controller served it as a `200`, so a caller received a value that
 * *looks* like a bearer token and is not one — the worst possible answer, because a client that
 * trusts it will send it as credentials.
 *
 * The path stays published. Removing it is itself a breaking change (§4.4), and the contract's own
 * description says so: it is *"retained rather than deleted"* and annotated instead. What changes
 * here is only what the server answers.
 *
 * | assertion | authority |
 * |---|---|
 * | `501` and no token of any kind in the body | §4.5; contract `x-mvp-scope: excluded` |
 * | the body is `application/problem+json` with `type`/`title`/`status` | §4.3; ADR-034; A4a's filter |
 * | `detail` is absent — 5xx never serialises an internal message | ADR-034; the filter's rule |
 * | `request_id` and `X-Correlation-ID` are present | §4.6 |
 */

import { Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';

import { configureApp } from '../../src/app.setup.js';
import { AuthModule } from '../../src/modules/auth/auth.module.js';
import {
  authorization,
  clearOidcEnv,
  setOidcEnv,
  startTokenFixture,
  type TokenFixture,
} from '../helpers/tokens.js';

const PROBLEM_MEDIA_TYPE = /^application\/problem\+json(; charset=utf-8)?$/;
const REFRESH = '/api/v1/auth/refresh';
const UUID = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';

let app: INestApplication;
let base = '';
let fixture: TokenFixture;
/**
 * A5b put this route behind the global guard, so *this* is what changed for it: the same `501`,
 * reached by an already-authenticated caller. The contract asked for a credential all along
 * (`security: [BearerAuth: []]` on this operation), and until A5b nothing read that line.
 */
let AUTH: Record<string, string> = {};

beforeAll(async () => {
  fixture = await startTokenFixture();
  setOidcEnv(fixture);
  app = await NestFactory.create(AuthModule, { logger: false });
  configureApp(app);
  await app.listen(0);
  base = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}`;
  AUTH = authorization(await fixture.accessToken(UUID, []));
});

afterAll(async () => {
  await app?.close();
  clearOidcEnv();
  await fixture.close();
});

async function refresh(): Promise<{ res: Response; body: Record<string, unknown> }> {
  const res = await fetch(`${base}${REFRESH}`, { method: 'POST', headers: AUTH });
  return { res, body: (await res.json()) as Record<string, unknown> };
}

describe('A5b — the guard is in front of this route too (§4.5)', () => {
  it('answers 401 to a caller who presents no token — before the 501', async () => {
    const res = await fetch(`${base}${REFRESH}`, { method: 'POST' });

    expect(res.status).toBe(401);
  });
});

describe('A5a — `POST /auth/refresh` is out of MVP scope (§4.5)', () => {
  it('answers 501, not 200', async () => {
    const { res } = await refresh();
    expect(res.status).toBe(501);
  });

  it('answers with `Problem`, not a body of its own shape', async () => {
    const { res, body } = await refresh();
    expect(res.headers.get('content-type')).toMatch(PROBLEM_MEDIA_TYPE);
    expect(body).toMatchObject({ type: 'about:blank', title: 'Not Implemented', status: 501 });
  });

  it('omits `detail`: a 5xx never serialises an internal message', async () => {
    const { body } = await refresh();
    expect(body).not.toHaveProperty('detail');
  });

  it('carries a `request_id` that is a uuid', async () => {
    const { body } = await refresh();
    expect(body['request_id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('carries the correlation id in the header as well as the body', async () => {
    const { res, body } = await refresh();
    expect(res.headers.get('x-correlation-id')).toBe(body['request_id']);
  });

  it('serves no token of any kind — the regression A0 logged is closed', async () => {
    const { body } = await refresh();
    const serialised = JSON.stringify(body);
    expect(serialised).not.toContain('access_token');
    expect(serialised).not.toContain('mock_access_token');
    expect(serialised).not.toContain('token');
  });
});
