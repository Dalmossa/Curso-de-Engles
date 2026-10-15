/**
 * P1.17 — the error pipeline emits the contract's `Problem`, not a look-alike.
 *
 * `docs/api-spec.openapi.yaml` declares `Problem` for all 14 4xx/5xx responses, and
 * `npm run contract:gate` fails if it stops doing so. Until this suite, **nothing checked the
 * served side**: the gate reads the document, and `tests/contract/schemas.spec.ts` validates
 * success payloads only (no fixture produces an error payload). So the document could say
 * `application/problem+json` while the server sent `application/json` — and for the whole life
 * of this API it did. Measured before this change, the filter emitted
 * `{type: 'https://httpstatuses.com/{status}', title: 'not_found', …}` as `application/json`.
 *
 * Each assertion below names the rule it enforces:
 *
 *   | what | rule |
 *   |---|---|
 *   | `Content-Type: application/problem+json` | `CONSTITUTION.md` §4.3 (mandatory) |
 *   | `type: about:blank` — not a third party's URI | RFC 9457 §3.1.1 (assumed default) + §4.2.1 |
 *   | `title` = the HTTP status phrase when `type` is `about:blank` | RFC 9457 §4.2.1 |
 *   | `status` = the status actually sent | RFC 9457 §3.1.2 ("MUST use the same status code") |
 *   | `request_id` = one id per **request**, not per error response | §4.6 + `Problem.request_id` |
 *   | no internal message in a 5xx body, ever | `CONSTITUTION.md` §4.3 |
 *
 * The negative control §4.3 asks for (ADR-034 D6) appears here and again over HTTP in
 * `tests/integration/error-response.spec.ts`. The internal strings used are the ones the
 * platform's own domain errors carry today: `LearnerContextError` names the GUC
 * `app.current_learner_id`, `DiagnosticPersistenceError` names the table and the DDL CHECK.
 */

import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import type { Request, Response } from 'express';

import {
  PROBLEM_CONTENT_TYPE,
  ProblemExceptionFilter,
  toProblem,
} from '../../src/common/filters/problem-exception.filter.js';
import { CORRELATION_ID_HEADER, isUuid, resolveCorrelationId } from '../../src/common/http/correlation.js';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** A request as the correlation middleware leaves it: path, query, correlation id. */
function request(url: string, correlationId?: string): Request {
  return {
    url,
    path: url.split('?')[0],
    method: 'GET',
    headers: {},
    ...(correlationId === undefined ? {} : { correlationId }),
  } as unknown as Request;
}

/**
 * A fake `ArgumentsHost` around a recording `Response`, wired to the Express chain the filter
 * calls (`status().type().send()`).
 */
function hostFor(
  url: string,
  correlationId?: string,
): {
  host: ArgumentsHost;
  sent: { status?: number; contentType?: string; body?: Record<string, unknown> };
} {
  const sent: { status?: number; contentType?: string; body?: Record<string, unknown> } = {};
  const response = {
    status(s: number) {
      sent.status = s;
      return this;
    },
    type(t: string) {
      sent.contentType = t;
      return this;
    },
    send(b: Record<string, unknown>) {
      sent.body = b;
      return this;
    },
  };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response as unknown as Response,
      getRequest: () => request(url, correlationId),
    }),
  } as unknown as ArgumentsHost;
  return { host, sent };
}

describe('P1.17 — resolveCorrelationId', () => {
  it('keeps a well-formed UUID the caller supplied', () => {
    const inbound = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
    expect(resolveCorrelationId(inbound)).toBe(inbound);
  });

  it.each([
    ['an empty string', ''],
    ['a token that is not a UUID', 'not-a-uuid'],
    ['a UUID followed by a newline (log injection)', '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d\nGET /admin'],
    ['a UUID followed by CRLF (header injection)', '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d\r\n'],
    ['a JSON-ish object', JSON.stringify({ id: 'x' })],
    ['a value long enough to be a nuisance', 'a'.repeat(5000)],
  ])('replaces %s with a fresh UUID v4', (_label, value) => {
    const out = resolveCorrelationId(value);
    expect(out).not.toBe(value);
    expect(UUID_V4.test(out)).toBe(true);
  });

  it('generates a UUID v4 when nothing was supplied', () => {
    for (const absent of [undefined, null]) {
      expect(UUID_V4.test(resolveCorrelationId(absent))).toBe(true);
    }
  });

  it('accepts only the contract\'s `format: uuid` shape (isUuid)', () => {
    expect(isUuid('3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d')).toBe(true);
    expect(isUuid('3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d\n')).toBe(false);
    expect(isUuid(7)).toBe(false);
    expect(isUuid(undefined)).toBe(false);
  });

  it('names the header CONSTITUTION §4.6 asks for', () => {
    expect(CORRELATION_ID_HEADER).toBe('X-Correlation-ID');
  });
});

describe('P1.17 — toProblem maps an exception onto the contract schema', () => {
  it('emits exactly the members of `Problem` — no `error`, no `message`, nothing extra', () => {
    const problem = toProblem(new NotFoundException('Lesson not found'), request('/api/v1/content/lessons/x'));
    expect(Object.keys(problem).sort()).toEqual(
      ['detail', 'instance', 'request_id', 'status', 'title', 'type'].sort(),
    );
  });

  it('sets type to about:blank, never to a third party\'s URI (RFC 9457 §3.1.1, §4.2.1)', () => {
    for (const exception of [
      new NotFoundException('Lesson not found'),
      new BadRequestException('Malformed dialogue_id'),
      new InternalServerErrorException('boom'),
      new Error('boom'),
    ]) {
      const problem = toProblem(exception, request('/api/v1/x'));
      expect(problem.type).toBe('about:blank');
      expect(JSON.stringify(problem)).not.toMatch(/httpstatuses\.com|https?:\/\//);
    }
  });

  it('uses the HTTP status phrase as title, and keeps it a function of the status', () => {
    expect(toProblem(new BadRequestException('x'), request('/api/v1/x')).title).toBe('Bad Request');
    expect(toProblem(new NotFoundException('x'), request('/api/v1/x')).title).toBe('Not Found');
    expect(toProblem(new Error('x'), request('/api/v1/x')).title).toBe('Internal Server Error');

    // Stable per problem type: two different 404 occurrences share the title, differ in `detail`.
    const a = toProblem(new NotFoundException('Lesson not found'), request('/api/v1/content/lessons/a'));
    const b = toProblem(new NotFoundException('Pack not found'), request('/api/v1/content/packs/b'));
    expect(a.title).toBe(b.title);
    expect(a.detail).not.toBe(b.detail);
  });

  it('repeats in `status` the code it will send (RFC 9457 §3.1.2)', () => {
    expect(toProblem(new BadRequestException('x'), request('/api/v1/x')).status).toBe(400);
    expect(toProblem(new NotFoundException('x'), request('/api/v1/x')).status).toBe(404);
    expect(toProblem(new InternalServerErrorException('x'), request('/api/v1/x')).status).toBe(500);
    expect(toProblem(new Error('x'), request('/api/v1/x')).status).toBe(500);
    expect(toProblem('a bare string', request('/api/v1/x')).status).toBe(500);
  });

  it('puts the occurrence-specific text in `detail`, stripped of Nest boilerplate', () => {
    const problem = toProblem(
      new NotFoundException('Dialogue audio not found'),
      request('/api/v1/content/listening/dlg_x/audio'),
    );
    expect(problem.detail).toBe('Dialogue audio not found');
    expect(problem.detail).not.toMatch(/statusCode|Exception/);
  });

  it('joins a validation message array into one string — `detail` is declared as a string', () => {
    const problem = toProblem(
      new BadRequestException({ statusCode: 400, message: ['a must be x', 'b is required'] }),
      request('/api/v1/x'),
    );
    expect(typeof problem.detail).toBe('string');
    expect(problem.detail).toBe('a must be x; b is required');
  });

  it('omits `detail` when it would only repeat the title', () => {
    const problem = toProblem(new NotFoundException(), request('/api/v1/x'));
    expect(problem.title).toBe('Not Found');
    expect(problem).not.toHaveProperty('detail');
  });

  it('contains no internal message in a 5xx — the negative control of §4.3', () => {
    for (const exception of [
      new Error('relation "diagnostic_results" does not exist'),
      new InternalServerErrorException('app.current_learner_id is blank; the DDL CHECK caps this at 3'),
    ]) {
      const problem = toProblem(exception, request('/api/v1/x'));
      expect(problem.status).toBe(500);
      expect(problem.title).toBe('Internal Server Error');
      expect(problem).not.toHaveProperty('detail');

      const serialised = JSON.stringify(problem);
      // `Error:` and not `Error`: the title legitimately reads "Internal Server Error".
      for (const needle of ['diagnostic_results', 'current_learner_id', 'DDL CHECK', 'Error:', '\n    at ']) {
        expect(serialised).not.toContain(needle);
      }
    }
  });

  it('identifies the occurrence by path only — never echoing the query string', () => {
    const problem = toProblem(
      new NotFoundException('Lesson not found'),
      request('/api/v1/content/lessons/x?token=secret-value&email=a%40b.c'),
    );
    expect(problem.instance).toBe('/api/v1/content/lessons/x');
    expect(JSON.stringify(problem)).not.toContain('secret-value');
    expect(JSON.stringify(problem)).not.toContain('a%40b.c');
  });

  it('carries one request_id per request — not one per error response', () => {
    const correlationId = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
    const req = request('/api/v1/x', correlationId);
    const first = toProblem(new NotFoundException('a'), req);
    const second = toProblem(new BadRequestException('b'), req);
    expect(first.request_id).toBe(correlationId);
    expect(second.request_id).toBe(first.request_id);
  });

  it('always emits a request_id, even with no correlation id on the request', () => {
    const problem = toProblem(new NotFoundException('a'), request('/api/v1/x'));
    expect(UUID_V4.test(problem.request_id)).toBe(true);
  });
});

describe('P1.17 — ProblemExceptionFilter over Express', () => {
  it('sends application/problem+json, at the exception\'s status, with the Problem body', () => {
    const { host, sent } = hostFor('/api/v1/content/lessons/nope');
    new ProblemExceptionFilter().catch(new NotFoundException('Lesson not found'), host);

    expect(sent.status).toBe(404);
    expect(sent.contentType).toBe(PROBLEM_CONTENT_TYPE);
    expect(PROBLEM_CONTENT_TYPE).toBe('application/problem+json');
    expect(sent.body).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Lesson not found',
      instance: '/api/v1/content/lessons/nope',
    });
    expect(UUID_V4.test(String(sent.body?.['request_id']))).toBe(true);
    expect(sent.body).not.toHaveProperty('error');
    expect(sent.body).not.toHaveProperty('message');
  });

  it('answers 500 without a detail when the thrown error is not an HttpException', () => {
    const { host, sent } = hostFor('/api/v1/x');
    new ProblemExceptionFilter().catch(new Error('relation "diagnostic_results" does not exist'), host);

    expect(sent.status).toBe(500);
    expect(sent.contentType).toBe(PROBLEM_CONTENT_TYPE);
    expect(sent.body?.['detail']).toBeUndefined();
    expect(JSON.stringify(sent.body)).not.toContain('diagnostic_results');
  });
});
