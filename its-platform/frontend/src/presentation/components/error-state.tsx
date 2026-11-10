'use client';

import { isDomainError, toDomainError, type DomainError } from '@/core';
import { domainErrorCopy, requestIdHint } from '../lib/copy';
import { Alert } from './ui/alert';
import { Button } from './ui/button';

export interface ErrorStateProps {
  readonly error: unknown;
  /** Rendered only when there is something to retry — see `ErrorCopy.showRetry`. */
  readonly onRetry?: () => void;
}

/**
 * The one place a `DomainError` becomes words.
 *
 * Anything that is not a `DomainError` is normalised first, so a thrown `TypeError` from a
 * component still renders something coherent instead of an empty box. The request id is
 * shown because CONSTITUTION.md §4.6 puts one on every response and a learner who quotes it
 * saves the support conversation that would otherwise start with "around 3pm".
 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const domainError: DomainError = isDomainError(error) ? error : toDomainError(error);
  const copy = domainErrorCopy(domainError);
  const requestId = requestIdHint(domainError);

  return (
    <Alert tone="danger" title={copy.title} data-testid="error-state" data-error-kind={domainError.kind}>
      <p>{copy.message}</p>
      {requestId === null ? null : <p className="mt-1 font-mono text-xs opacity-80">{requestId}</p>}
      {copy.showRetry && onRetry !== undefined ? (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          {copy.action}
        </Button>
      ) : null}
    </Alert>
  );
}
