/**
 * P1.17 — the one place that builds an error body.
 *
 * Before this rewrite the platform had **two** error shapes and neither was the contract's:
 *
 * - this filter emitted `application/json` with `type: https://httpstatuses.com/{status}` and
 *   `title: <machine code>` (measured: lines 33–43 of the previous revision);
 * - the controllers hand-rolled `{error, message, request_id}` bodies on 7 throws
 *   (`content.controller.ts` ×6, `learners.controller.ts` ×1) whose `request_id` the filter then
 *   discarded, because it read only `error`/`message`/`details` from the exception.
 *
 * Meanwhile `docs/api-spec.openapi.yaml` declares `Problem` — `application/problem+json`, members
 * `type`/`title`/`status`/`detail`/`instance`/`request_id` — for all 14 4xx/5xx responses, and
 * `CONSTITUTION.md` §4.3 makes RFC 9457 mandatory. This file closes that gap; the controllers now
 * throw plain messages and nothing else builds a body.
 *
 * The rules are not this file's invention — each member follows the cited authority, and no member
 * beyond the schema's six is emitted (ADR-034's `code`, `errors[]` and per-type URIs are `Proposed`
 * and depend on the canonical `type` domain being decided; see `reports/api/fase-4.md` §8):
 *
 * - `type: about:blank` — the schema's declared default and RFC 9457 §4.2.1's registered type for
 *   "no additional semantics beyond the HTTP status code". A third party's URI (`httpstatuses.com`)
 *   claims a namespace this platform does not own.
 * - `title` — the HTTP status phrase, which is what RFC 9457 §4.2.1 requires once `type` is
 *   `about:blank`, and is by construction stable across occurrences of one problem type.
 * - `status` — RFC 9457 §3.1.2: "MUST use the same status code in the actual HTTP response".
 * - `detail` — the occurrence-specific message, and **never** an internal one: §4.3 forbids
 *   serialising internal messages, so a 5xx carries no `detail` at all and the message goes to the
 *   log instead. `getResponse().message` may be an array (that is what Nest's `ValidationPipe`
 *   produces) while the schema declares a string, so arrays are joined — per-field structure is
 *   ADR-034 D5's open question, not something to invent here.
 * - `instance` — the request path **without** the query string: a query can carry a token or an
 *   address, and echoing it back into a body that clients and proxies log would spread it
 *   (§4.5 data minimisation).
 * - `request_id` — the request's correlation id (§4.6), read from the request rather than
 *   generated per response; see `src/common/http/correlation.ts`.
 */

import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { STATUS_CODES } from 'node:http';
import type { Request, Response } from 'express';

import { correlationIdOf } from '../http/correlation.js';

/** §4.3's mandatory media type. The document declares it for all 14 error responses. */
export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

/** RFC 9457 §3.1.1: the value assumed when `type` is absent, and §4.2.1's registered type. */
export const ABOUT_BLANK = 'about:blank';

/** The contract's `Problem` members, in the schema's order. */
export interface ProblemBody {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance: string;
  request_id: string;
}

/**
 * RFC 9110 §15 reason phrases, as Node's own table (`http.STATUS_CODES`) holds them. The fallback
 * is unreachable for the statuses this API can produce and exists only so a member is never
 * `undefined`.
 */
function statusTitle(status: number): string {
  return STATUS_CODES[status] ?? (status >= 500 ? 'Internal Server Error' : 'Error');
}

/** The path alone — see the `instance` note in this file's header. */
function instanceOf(request: Request): string {
  const path = typeof request.path === 'string' ? request.path : '';
  if (path !== '') return path;
  return String(request.url ?? '').split('?')[0] ?? '';
}

/**
 * The occurrence's message, or `undefined` when there must not be one.
 *
 * A 5xx never carries one (§4.3), and neither does an exception with no message of its own — a
 * bare `new NotFoundException()` would otherwise answer `detail: "Not Found"`, repeating the title.
 */
function detailOf(exception: unknown, status: number): string | undefined {
  if (status >= 500) return undefined;
  if (!(exception instanceof HttpException)) return undefined;

  const response = exception.getResponse();
  const raw = typeof response === 'string' ? response : (response as { message?: unknown }).message;
  const text = Array.isArray(raw)
    ? raw.filter((entry): entry is string => typeof entry === 'string').join('; ')
    : raw;

  if (typeof text !== 'string') return undefined;
  const trimmed = text.trim();
  if (trimmed === '' || trimmed === statusTitle(status)) return undefined;
  return trimmed;
}

function nameOf(exception: unknown): string {
  if (exception instanceof Error) return exception.name;
  return typeof exception;
}

function stackOf(exception: unknown): string | undefined {
  return exception instanceof Error ? exception.stack : undefined;
}

/** Pure mapping: exception × request → the body this API sends. Exported for its unit tests. */
export function toProblem(exception: unknown, request: Request): ProblemBody {
  const status =
    exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  const detail = detailOf(exception, status);

  return {
    type: ABOUT_BLANK,
    title: statusTitle(status),
    status,
    ...(detail === undefined ? {} : { detail }),
    instance: instanceOf(request),
    request_id: correlationIdOf(request),
  };
}

@Catch()
export class ProblemExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const problem = toProblem(exception, request);

    // The internal message goes here — never into the body. `instance` is a path, so the log line
    // carries no query string either.
    if (problem.status >= 500) {
      this.logger.error(
        `${request.method ?? '?'} ${problem.instance} -> ${problem.status} ` +
          `[${problem.request_id}] ${nameOf(exception)}`,
        stackOf(exception),
      );
    }

    response.status(problem.status).type(PROBLEM_CONTENT_TYPE).send(problem);
  }
}
