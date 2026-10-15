/**
 * The request's correlation id — the `Problem.request_id` member and the `Correlation-ID` that
 * `CONSTITUTION.md` §4.6 requires on every log line and every response.
 *
 * Measured before this module existed: the filter called `randomUUID()` **per error response**
 * (`src/common/filters/problem-exception.filter.ts:39` in A0's reading of it), so two errors in
 * one request carried two ids, and neither matched anything else the platform logged. Nothing
 * accepted an id from the caller either, which is what makes a trace span a gateway hop
 * (`iac/kong/kong.yml` has no `correlation-id` plugin yet — ADR-006 schedules it, ADR-030 records
 * it as missing).
 *
 * Two properties are deliberate and each is asserted in
 * `tests/unit/problem-exception.filter.spec.ts`:
 *
 * 1. **The inbound value is adopted only if it is a UUID.** `Problem.request_id` is declared
 *    `format: uuid`, and an unvalidated inbound header is a header-injection and log-injection
 *    vector (§4.6 requires logs to be injection-safe). Anything else — including a valid UUID
 *    followed by a newline — is replaced.
 * 2. **The generated value is UUID v4** (`node:crypto.randomUUID`), the same shape ADR-006's Kong
 *    `uuid#counter` generator produces, so the gateway can later own the id without a change here.
 */

import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

/**
 * The header name. `CONSTITUTION.md` §4.6 names the *concept* (`Correlation-ID`) and
 * `Problem.request_id` names the body member, but no decision in this repository fixes the header
 * spelling: ADR-006 prescribes Kong's `correlation-id` plugin without setting `header_name`
 * (Kong's default is `Kong-Request-ID`), and `iac/kong/kong.yml` does not load the plugin at all.
 * `X-Correlation-ID` is the spelling the platform's own API conventions use; it is declared here
 * once so that the day the gateway sets it, one constant moves. Recorded as an open decision in
 * `reports/api/fase-4.md` §8 — not as a settled one.
 */
export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

/** Request property the middleware writes and the filter reads. */
export const CORRELATION_ID_PROPERTY = 'correlationId';

/** RFC 4122 §3 shape — any version, which is what the contract's `format: uuid` accepts. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Longest value worth looking at; anything longer is not a UUID and is not worth a regex run. */
const MAX_INBOUND_LENGTH = 64;

interface CorrelatedRequest extends Request {
  [CORRELATION_ID_PROPERTY]?: string;
}

/** True when `value` is a UUID the contract would accept for `request_id`. */
export function isUuid(value: unknown): boolean {
  return typeof value === 'string' && value.length <= MAX_INBOUND_LENGTH && UUID.test(value);
}

/** The inbound value when it is a UUID, a fresh UUID v4 otherwise. */
export function resolveCorrelationId(inbound: unknown): string {
  return isUuid(inbound) ? (inbound as string) : randomUUID();
}

/**
 * Express middleware: adopt the caller's correlation id if it is a UUID, otherwise generate one,
 * expose it on the request, and echo it in the response header — for **every** response, not only
 * for errors (§4.6). Registered in `src/app.setup.ts`, which is the composition root both
 * `main.ts` and `tests/integration/error-response.spec.ts` use.
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers[CORRELATION_ID_HEADER.toLowerCase()];
  const correlationId = resolveCorrelationId(Array.isArray(header) ? header[0] : header);
  (req as CorrelatedRequest)[CORRELATION_ID_PROPERTY] = correlationId;
  res.setHeader(CORRELATION_ID_HEADER, correlationId);
  next();
}

/**
 * The id for this request. Falls back to generating one so that the error body always carries a
 * well-formed `request_id` even if the filter is reached without the middleware (a unit-level
 * call, or an app built without `configureApp`).
 */
export function correlationIdOf(req: Request): string {
  const existing = (req as CorrelatedRequest)[CORRELATION_ID_PROPERTY];
  return isUuid(existing) ? (existing as string) : randomUUID();
}
