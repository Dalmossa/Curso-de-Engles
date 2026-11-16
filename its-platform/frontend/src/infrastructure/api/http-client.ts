import {
  invalidResponseToDomainError,
  parseRetryAfter,
  problemDetailsToDomainError,
  transportFailureToDomainError,
  type ProblemDetailsShape,
} from '@/core';

/** A request with its URL already built. `HttpClient` knows nothing about operations. */
export interface ResolvedRequest {
  readonly method: 'GET' | 'POST' | 'PATCH';
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: unknown;
  readonly signal?: AbortSignal;
}

export interface HttpClientOptions {
  /** Injected so tests exercise the real client against a stub instead of a global mock. */
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
  /** Test seam for the error message on an aborted request. */
  readonly describeUrl?: (url: string) => string;
}

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * The one place that speaks HTTP, and the one place that speaks RFC 9457.
 *
 * Everything above it sees `DomainError`; everything below it sees strings. That is the
 * whole job: translate a transport into the domain's vocabulary of failures, so no
 * component ever writes `if (response.status === 404)`.
 */
export class HttpClient {
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;
  private readonly describeUrl: (url: string) => string;

  constructor(options: HttpClientOptions = {}) {
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.describeUrl = options.describeUrl ?? ((url) => url);
  }

  async send<T>(request: ResolvedRequest): Promise<T> {
    const signal = this.buildSignal(request.signal);

    let response: Response;
    try {
      response = await this.fetchImpl(request.url, {
        method: request.method,
        headers: {
          // Both types are named: the API answers errors with `application/problem+json`,
          // and a server that cannot see that in `Accept` may fall back to an HTML page.
          Accept: 'application/json, application/problem+json',
          ...(request.body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...request.headers,
        },
        ...(request.body === undefined ? {} : { body: JSON.stringify(request.body) }),
        // Learner-specific data. Never cached, at any layer, ever.
        cache: 'no-store',
        credentials: 'include',
        ...(signal === undefined ? {} : { signal }),
        redirect: 'error',
        referrerPolicy: 'no-referrer',
      });
    } catch (cause) {
      throw transportFailureToDomainError(cause, this.describeTransportFailure(request, cause));
    }

    // Read the body once: a Response body is a stream, and a second read throws.
    const raw = await response.text().catch(() => '');

    if (!response.ok) {
      throw problemDetailsToDomainError({
        status: response.status,
        problem: parseProblemBody(raw, response.headers.get('content-type')),
        retryAfterSeconds: parseRetryAfter(response.headers.get('retry-after')),
      });
    }

    // `204`, and any 2xx a handler answers with an empty body: nothing to parse.
    if (raw.trim() === '') return undefined as T;

    try {
      return JSON.parse(raw) as T;
    } catch (cause) {
      throw invalidResponseToDomainError(
        `${this.describeUrl(request.url)} answered ${response.status} with a body that is not JSON.`,
        cause,
      );
    }
  }

  /**
   * The caller's signal and the timeout are combined rather than nested: a request can be
   * cancelled by the page navigating away *or* by the deadline, and only one of those is
   * worth telling the learner about.
   */
  private buildSignal(callerSignal: AbortSignal | undefined): AbortSignal | undefined {
    if (this.timeoutMs <= 0) return callerSignal;
    const timeout = AbortSignal.timeout(this.timeoutMs);
    return callerSignal === undefined ? timeout : AbortSignal.any([callerSignal, timeout]);
  }

  private describeTransportFailure(request: ResolvedRequest, cause: unknown): string {
    if (request.signal?.aborted) {
      return `The request to ${this.describeUrl(request.url)} was cancelled.`;
    }
    if (cause instanceof Error && (cause.name === 'TimeoutError' || cause.name === 'AbortError')) {
      return `The request to ${this.describeUrl(request.url)} timed out after ${this.timeoutMs} ms.`;
    }
    return `The request to ${this.describeUrl(request.url)} could not be completed.`;
  }
}

/**
 * A body is a Problem Details document when it parses as JSON and looks like one.
 *
 * The content type is consulted first, but a body that carries `title`/`status` is
 * treated as a problem document whatever the header claims — a proxy in between is a
 * common reason `application/problem+json` goes missing, and refusing to read a real
 * problem body because of a missing header would turn a clear `404` into "unparseable
 * response".
 */
export function parseProblemBody(raw: string, contentType: string | null): ProblemDetailsShape | null {
  if (raw.trim() === '') return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

  const body = parsed as Record<string, unknown>;
  const declaredProblem = (contentType ?? '').toLowerCase().includes('application/problem+json');
  const looksLikeProblem = 'title' in body || 'detail' in body || 'status' in body;

  if (declaredProblem) return body as ProblemDetailsShape;
  return looksLikeProblem ? (body as ProblemDetailsShape) : null;
}
