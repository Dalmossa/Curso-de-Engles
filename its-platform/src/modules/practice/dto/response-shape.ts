/**
 * A5a — the shape of `PracticeSubmission.responses[].response`.
 *
 * The contract declares this member as a `oneOf`:
 *
 * ```yaml
 * response:
 *   oneOf:
 *     - type: string          # the selected option letter (A, B, C, D)
 *     - type: object          # a production response: an ASR transcript, an audio reference
 *       properties: {transcript: string, audio_ref: uri}
 * ```
 *
 * class-validator cannot express a union, and `ValidationPipe`'s `whitelist` cannot reach **inside**
 * one: without this constraint the object branch would be an unchecked bag of members, which is the
 * opposite of what `CONSTITUTION.md` §4.5 mandates (*"non-whitelisted properties are rejected"*).
 * So the branch is validated here: a string is accepted as-is, an object must carry **only** the
 * two members the contract declares, each a string.
 *
 * Three deliberate non-inventions, all recorded in `reports/api/fase-5.md` §8:
 *
 * - the string branch accepts **any** string. The contract says `type: string` with the description
 *   *"Selected option letter (A, B, C, D)"*; a description is not a constraint, and turning it into
 *   `^[A-D]$` would reject the production and minimal-pair items whose response is a transcript.
 * - `{}` is accepted. The contract marks neither member of the object branch as required, so
 *   "at least one of them" would be an invented rule.
 * - `audio_ref`'s `format: uri` is not enforced: `format` is an annotation in JSON Schema, and
 *   pinning a URI grammar here would be a second invention.
 *
 * The message names the offending member. A body that answers *"response must be a string or an
 * object"* without saying which member was refused makes the caller guess, and A4a's `detail` is
 * where an occurrence explains itself.
 */

import type { ValidationArguments } from 'class-validator';
import { Validate, ValidatorConstraint } from 'class-validator';
import type { ValidatorConstraintInterface } from 'class-validator';

/** The two members `PracticeSubmission.responses[].response` declares in its object branch. */
export const RESPONSE_OBJECT_MEMBERS = ['transcript', 'audio_ref'] as const;

/** Why a value is not a legal `response`, or `null` when it is one. */
export function responseShapeViolation(value: unknown): string | null {
  if (typeof value === 'string') return null;
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return 'it is neither a string nor an object';
  }

  for (const [member, memberValue] of Object.entries(value)) {
    if (!(RESPONSE_OBJECT_MEMBERS as readonly string[]).includes(member)) {
      return `\`${member}\` is not declared by its object branch (only ${RESPONSE_OBJECT_MEMBERS.join(', ')})`;
    }
    if (typeof memberValue !== 'string') return `\`${member}\` is not a string`;
  }
  return null;
}

/** The predicate alone, usable without class-validator. */
export function isResponseShape(value: unknown): boolean {
  return responseShapeViolation(value) === null;
}

@ValidatorConstraint({ name: 'isResponseShape' })
export class ResponseShapeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return isResponseShape(value);
  }

  /**
   * Always the violation report: class-validator only asks for a message after `validate` returned
   * false, so `responseShapeViolation` has something to report. The `??` is a null-safety net over
   * an `unknown` argument, not a second rule.
   */
  defaultMessage(args: ValidationArguments): string {
    return `response was refused: ${responseShapeViolation(args.value) ?? 'it is not a response'}`;
  }
}

export function IsResponseShape(): PropertyDecorator {
  return Validate(ResponseShapeConstraint);
}
