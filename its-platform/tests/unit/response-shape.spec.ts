/**
 * A5a — the two decisions inside `PracticeSubmission.responses[].response` that cannot be derived
 * from class-validator alone, tested where they live rather than only through the pipe.
 *
 * The integration suite (`tests/integration/request-validation.spec.ts`) proves the end-to-end
 * behaviour: the object branch reaches the constraint, and a member it does not declare is refused
 * with `400`. What it cannot show cheaply is the *boundary* of the union — the values that are
 * neither a string nor an object, the empty object the contract permits, and the message naming the
 * member that was refused. Those are assertions about `responseShapeViolation` itself.
 */

import type { ValidationArguments } from 'class-validator';

import {
  RESPONSE_OBJECT_MEMBERS,
  ResponseShapeConstraint,
  isResponseShape,
  responseShapeViolation,
} from '../../src/modules/practice/dto/response-shape.js';

const constraint = new ResponseShapeConstraint();

function messageFor(value: unknown): string {
  return constraint.defaultMessage({ value } as ValidationArguments);
}

describe('A5a — `responseShapeViolation`', () => {
  it('accepts any string — the contract’s string branch is `type: string` with no pattern', () => {
    for (const value of ['B', '', 'I would like to book a room', 'A, E, I, O, U']) {
      expect(responseShapeViolation(value)).toBeNull();
    }
  });

  it('accepts the empty object: the contract marks neither declared member required', () => {
    expect(isResponseShape({})).toBe(true);
  });

  it('accepts either declared member, together or alone', () => {
    expect(isResponseShape({ transcript: 'x' })).toBe(true);
    expect(isResponseShape({ audio_ref: 'https://example.com/take-1.mp3' })).toBe(true);
    expect(
      isResponseShape({ transcript: 'x', audio_ref: 'https://example.com/take-1.mp3' }),
    ).toBe(true);
  });

  it('refuses the values that are neither a string nor an object', () => {
    for (const value of [null, undefined, 5, true, [], ['transcript']]) {
      expect(isResponseShape(value)).toBe(false);
    }
    expect(responseShapeViolation(null)).toBe('it is neither a string nor an object');
  });

  it('refuses an undeclared member and names it', () => {
    expect(responseShapeViolation({ transcript: 'x', debug: true })).toBe(
      '`debug` is not declared by its object branch (only transcript, audio_ref)',
    );
  });

  it('refuses a declared member carrying a non-string', () => {
    expect(responseShapeViolation({ transcript: 5 })).toBe('`transcript` is not a string');
    expect(responseShapeViolation({ audio_ref: { href: 'x' } })).toBe(
      '`audio_ref` is not a string',
    );
  });

  it('`isResponseShape` agrees with the violation report in both directions', () => {
    for (const value of ['B', {}, { transcript: 'x' }, null, 5, [], { debug: 1 }, { theta: 1 }]) {
      expect(isResponseShape(value)).toBe(responseShapeViolation(value) === null);
    }
  });

  it('the refused-value message names the member, so `detail` can explain the occurrence', () => {
    expect(messageFor({ debug: true })).toContain('debug');
    expect(messageFor({ transcript: 5 })).toContain('transcript');
    expect(messageFor(null)).toContain('neither a string nor an object');
    // The declared members appear in the *declaration* the constraint reports, so a caller reading
    // `detail` learns what the object branch does accept.
    expect(RESPONSE_OBJECT_MEMBERS.join(', ')).toBe('transcript, audio_ref');
    expect(messageFor({ debug: true })).toContain(RESPONSE_OBJECT_MEMBERS.join(', '));
  });
});
