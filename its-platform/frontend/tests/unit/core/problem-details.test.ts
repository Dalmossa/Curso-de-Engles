// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  errorKindForStatus,
  parseRetryAfter,
  problemDetailsToDomainError,
  transportFailureToDomainError,
} from '@/core/errors/problem-details';

describe('problem-details', () => {
  it('maps status codes to kinds', () => {
    expect(errorKindForStatus(400)).toBe('invalid_input');
    expect(errorKindForStatus(401)).toBe('unauthorized');
    expect(errorKindForStatus(403)).toBe('forbidden');
    expect(errorKindForStatus(404)).toBe('not_found');
    expect(errorKindForStatus(429)).toBe('rate_limited');
    expect(errorKindForStatus(500)).toBe('server');
    expect(errorKindForStatus(503)).toBe('server');
    expect(errorKindForStatus(999)).toBe('unknown');
  });

  it('parses Retry-After delta seconds', () => {
    expect(parseRetryAfter('5')).toBe(5);
    expect(parseRetryAfter(' 0 ')).toBe(0);
    expect(parseRetryAfter('')).toBeNull();
    expect(parseRetryAfter('Wed, 21 Oct 2015 07:28:00 GMT')).toBeNull();
    expect(parseRetryAfter('abc')).toBeNull();
  });

  it('converts transport failure to domain error', () => {
    const err = transportFailureToDomainError(new Error('fail'), 'request failed');
    expect(err.kind).toBe('network');
    expect(err.status).toBeNull();
    expect(err.detail).toContain('request failed');
  });

  it('maps problem details', () => {
    const err = problemDetailsToDomainError({
      status: 404,
      problem: { title: 'Not Found', detail: 'Lesson not found' },
    });
    expect(err.kind).toBe('not_found');
    expect(err.status).toBe(404);
    expect(err.title).toBe('Not Found');
    expect(err.detail).toBe('Lesson not found');
  });
});
