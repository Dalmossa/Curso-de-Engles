import type { LessonPhase } from '../entities/lesson';
import { invalidResponseToDomainError } from '../errors/problem-details';

/** ADR-027 §4: four phases, in order. `phases` is `minItems: 4, maxItems: 4` in the contract. */
export const LESSON_PHASE_COUNT = 4;

/**
 * Enforces the four-phase invariant on data that claims to satisfy it.
 *
 * The API measured 122 of 122 lessons yielding phases `[1,2,3,4]`, so a payload that
 * does not is either a regression or a different problem type served under this path.
 * Neither should reach the renderer as a silently short lesson: a learner seeing
 * three phases has no way to tell whether phase 4 does not exist or failed to load.
 *
 * Returns the phases ordered by `phase`, so a server that reorders the array is not a
 * rendering bug.
 */
export function normalizeLessonPhases(phases: readonly LessonPhase[]): readonly LessonPhase[] {
  if (phases.length !== LESSON_PHASE_COUNT) {
    throw invalidResponseToDomainError(
      `A lesson must carry exactly ${LESSON_PHASE_COUNT} phases; received ${phases.length}.`,
    );
  }

  const seen = new Set<number>();
  for (const phase of phases) {
    if (!Number.isInteger(phase.phase) || phase.phase < 1 || phase.phase > LESSON_PHASE_COUNT) {
      throw invalidResponseToDomainError(
        `Lesson phase number ${String(phase.phase)} is outside 1..${LESSON_PHASE_COUNT}.`,
      );
    }
    if (seen.has(phase.phase)) {
      throw invalidResponseToDomainError(`Lesson phase ${phase.phase} appears more than once.`);
    }
    seen.add(phase.phase);
  }

  return phases.slice().sort((left, right) => left.phase - right.phase);
}
