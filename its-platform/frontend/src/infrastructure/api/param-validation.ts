import { DomainError } from '@/core';
import type { OperationSpec, ParamSpec } from './operations';

export interface ParamFailure {
  readonly parameter: string;
  readonly expectation: string;
  readonly value: string;
}

function check(spec: ParamSpec, value: string | undefined, required: boolean): ParamFailure | null {
  if (value === undefined || value === '') {
    if (!required) return null;
    return { parameter: spec.name, expectation: spec.expectation, value: '' };
  }
  if (!spec.isValid(value)) {
    return { parameter: spec.name, expectation: spec.expectation, value };
  }
  return null;
}

/**
 * Path parameters are required; query parameters are not. A supplied value that the
 * contract's own pattern rejects is a failure either way — the platform would answer
 * `400` and there is nothing to gain from making the round trip to find that out.
 */
export function findParamFailures(
  spec: OperationSpec,
  supplied: Readonly<Record<string, string | undefined>>,
): readonly ParamFailure[] {
  const failures: ParamFailure[] = [];
  for (const param of spec.pathParams) {
    const failure = check(param, supplied[param.name], true);
    if (failure) failures.push(failure);
  }
  for (const param of spec.queryParams) {
    const failure = check(param, supplied[param.name], false);
    if (failure) failures.push(failure);
  }
  return failures;
}

/** Keys the operation does not declare. Refused rather than dropped. */
export function findUnknownParams(spec: OperationSpec, keys: readonly string[]): readonly string[] {
  const declared = new Set<string>([
    ...spec.pathParams.map((param) => param.name),
    ...spec.queryParams.map((param) => param.name),
  ]);
  return keys.filter((key) => !declared.has(key));
}

/**
 * A parameter the server owns. Anything here arriving from a client is not a typo to be
 * ignored: it is an attempt to name another learner, and ignoring it silently would leave
 * the caller believing it worked.
 */
export function findServerResolvedParams(spec: OperationSpec, keys: readonly string[]): readonly string[] {
  const owned = new Set(spec.serverResolvedParams);
  return keys.filter((key) => owned.has(key));
}

export function describeParamFailure(failure: ParamFailure): string {
  return failure.value === ''
    ? `The required parameter "${failure.parameter}" is missing; expected ${failure.expectation}.`
    : `The parameter "${failure.parameter}" is invalid; expected ${failure.expectation}.`;
}

/** Throws `invalid_input` for a call the contract forbids. Used by the server gateway. */
export function assertParams(spec: OperationSpec, supplied: Readonly<Record<string, string | undefined>>): void {
  const failures = findParamFailures(spec, supplied);
  if (failures.length === 0) return;
  throw new DomainError({
    kind: 'invalid_input',
    status: null,
    title: 'Invalid request parameters',
    detail: failures.map(describeParamFailure).join(' '),
    problemType: null,
    requestId: null,
    retryAfterSeconds: null,
  });
}
