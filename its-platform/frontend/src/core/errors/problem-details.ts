import { DomainError, type DomainErrorKind } from './domain-error';

/**
 * A structurally-typed view of RFC 9457 Problem Details
 * (`CONSTITUTION.md` §4.3; every 4xx/5xx in `api-spec.openapi.yaml` declares it).
 *
 * Deliberately `unknown`-valued and not the generated `components['schemas']['Problem']`:
 * this function has to cope with a body that does *not* match the contract, and a
 * typed parameter would make that impossible to express. The generated type is the
 * promise; this is what the wire actually delivered.
 */
export interface ProblemDetailsShape {
  readonly type?: unknown;
  readonly title?: unknown;
  readonly status?: unknown;
  readonly detail?: unknown;
  readonly instance?: unknown;
  readonly request_id?: unknown;
}

const PROBLEM_MEDIA_TYPE = 'application/problem+json';

export { PROBLEM_MEDIA_TYPE };

export function errorKindForStatus(status: number): DomainErrorKind {
  if (status === 400) return 'invalid_input';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limited';
  if (status >= 500 && status <= 599) return 'server';
  return 'unknown';
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

/**
 * Where a `Problem` body is absent or malformed, the only honest thing to say is
 * what the status line said. Never invent a `title` the server did not send.
 */
export function problemDetailsToDomainError(input: {
  status: number;
  problem?: ProblemDetailsShape | null;
  retryAfterSeconds?: number | null;
  cause?: unknown;
}): DomainError {
  const { problem, retryAfterSeconds = null } = input;

  // The body repeats the status "for client convenience"; when it disagrees with
  // the status line, the status line is the one the transport actually enforced.
  const status = input.status;

  const title = asNonEmptyString(problem?.title) ?? '';
  const detail = asNonEmptyString(problem?.detail) ?? title;

  return new DomainError({
    kind: errorKindForStatus(status),
    status,
    title,
    detail,
    problemType: asNonEmptyString(problem?.type),
    requestId: asNonEmptyString(problem?.request_id),
    retryAfterSeconds: retryAfterSeconds !== null && Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : null,
    cause: input.cause,
  });
}

/** A `fetch` rejection, an abort, or a timeout: no response ever existed. */
export function transportFailureToDomainError(cause: unknown, detail: string): DomainError {
  return new DomainError({
    kind: 'network',
    status: null,
    title: '',
    detail,
    problemType: null,
    requestId: null,
    retryAfterSeconds: null,
    cause,
  });
}

/** A response arrived, but its body is not what the contract promised. */
export function invalidResponseToDomainError(detail: string, cause?: unknown): DomainError {
  return new DomainError({
    kind: 'invalid_response',
    status: null,
    title: '',
    detail,
    problemType: null,
    requestId: null,
    retryAfterSeconds: null,
    cause,
  });
}

/**
 * `Retry-After` is either delta-seconds or an HTTP-date (RFC 9110 §10.2.3).
 * Only the delta-seconds form is converted; a date would need a clock, and a wrong
 * number is worse than none.
 */
export function parseRetryAfter(headerValue: string | null | undefined): number | null {
  if (!headerValue) return null;
  const trimmed = headerValue.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const seconds = Number.parseInt(trimmed, 10);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}
