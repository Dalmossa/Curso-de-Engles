import type { DomainError, DomainErrorKind } from '@/core';
import { DomainError as DomainErrorClass } from '@/core';

/**
 * What a Server Action returns when it fails.
 *
 * A Server Action that throws reaches the browser as a redacted error carrying only a
 * digest — in production the message, the `kind` and the correlation id are all gone, which
 * is precisely the information the error state is built to show. So a failure is returned as
 * data instead, and rebuilt into a `DomainError` on the client where `ErrorState` already
 * knows what to do with it.
 */
export interface SerializedDomainError {
  readonly kind: DomainErrorKind;
  readonly status: number | null;
  readonly title: string;
  readonly detail: string;
  readonly problemType: string | null;
  readonly requestId: string | null;
  readonly retryAfterSeconds: number | null;
}

export type ActionResult<T> = { readonly ok: true; readonly data: T } | { readonly ok: false; readonly error: SerializedDomainError };

export function serializeDomainError(error: DomainError): SerializedDomainError {
  return {
    kind: error.kind,
    status: error.status,
    title: error.title,
    detail: error.detail,
    problemType: error.problemType,
    requestId: error.requestId,
    retryAfterSeconds: error.retryAfterSeconds,
  };
}

export function deserializeDomainError(serialized: SerializedDomainError): DomainError {
  return new DomainErrorClass(serialized);
}
