/**
 * The only error type the domain and the application layers ever see.
 *
 * `infrastructure` translates transport failures (a `fetch` rejection, a
 * `401`, an RFC 9457 body) into these; `presentation` renders them. Neither the
 * HTTP status code nor the Problem Details vocabulary leaks past this boundary,
 * so a component never has to know what "500" means.
 *
 * No user-facing copy lives here: `title` carries whatever the server said (and is
 * empty for transport-level failures, where no server spoke), and
 * `presentation/lib/copy.ts` owns the Portuguese strings.
 */
export type DomainErrorKind =
  /** The request never produced a response: DNS, refused connection, abort, timeout. */
  | 'network'
  /** `401` — no credential, or one the platform rejected. */
  | 'unauthorized'
  /** `403` — authenticated, but the credential lacks the required authority. */
  | 'forbidden'
  /** `404` — including the several "not found, or found but not servable" cases. */
  | 'not_found'
  /** `400` — the request was malformed, or carried a member the contract forbids. */
  | 'invalid_input'
  /** `429` — rate limited; `retryAfterSeconds` says for how long, when the API said. */
  | 'rate_limited'
  /** `5xx` — the platform failed. */
  | 'server'
  /** A response arrived and contradicted the contract (unparseable body, impossible shape). */
  | 'invalid_response'
  /** Anything not covered above. */
  | 'unknown';

export interface DomainErrorInit {
  readonly kind: DomainErrorKind;
  /** The HTTP status when a response existed, `null` when none did. */
  readonly status: number | null;
  /** `Problem.title` — a summary stable across occurrences of the same problem type. */
  readonly title: string;
  /** `Problem.detail` — the human-readable explanation specific to this occurrence. */
  readonly detail: string;
  /** `Problem.type` — a URI reference identifying the problem type. */
  readonly problemType: string | null;
  /** `Problem.request_id` — the correlation id (CONSTITUTION.md §4.6). */
  readonly requestId: string | null;
  readonly retryAfterSeconds: number | null;
  readonly cause?: unknown;
}

export class DomainError extends Error {
  readonly kind: DomainErrorKind;
  readonly status: number | null;
  readonly title: string;
  readonly detail: string;
  readonly problemType: string | null;
  readonly requestId: string | null;
  readonly retryAfterSeconds: number | null;

  constructor(init: DomainErrorInit) {
    // `Error.message` is the most specific human-readable string available; the UI
    // may still prefer its own copy, which is why `kind` is the field to branch on.
    super(init.detail || init.title || init.kind, { cause: init.cause });
    this.name = 'DomainError';
    this.kind = init.kind;
    this.status = init.status;
    this.title = init.title;
    this.detail = init.detail;
    this.problemType = init.problemType;
    this.requestId = init.requestId;
    this.retryAfterSeconds = init.retryAfterSeconds;
  }

  /** Worth offering the learner a retry button for. */
  get isRetryable(): boolean {
    return this.kind === 'network' || this.kind === 'server' || this.kind === 'rate_limited';
  }

  /** The learner's session is the problem, not the request. */
  get isAuthenticationFailure(): boolean {
    return this.kind === 'unauthorized' || this.kind === 'forbidden';
  }

  /**
   * The offending value exists but the learner has no access to it — the UI should
   * say "not available" rather than "you did something wrong".
   */
  get isMissingResource(): boolean {
    return this.kind === 'not_found';
  }
}

export function isDomainError(value: unknown): value is DomainError {
  return value instanceof DomainError;
}

/** Normalises anything a `catch` can produce into a `DomainError`. */
export function toDomainError(value: unknown): DomainError {
  if (isDomainError(value)) return value;
  const detail = value instanceof Error ? value.message : String(value);
  return new DomainError({
    kind: 'unknown',
    status: null,
    title: '',
    detail,
    problemType: null,
    requestId: null,
    retryAfterSeconds: null,
    cause: value,
  });
}
