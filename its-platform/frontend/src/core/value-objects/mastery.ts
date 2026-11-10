/**
 * The mastery gate.
 *
 * `0.85` is not a design choice made here: it is the number the contract publishes.
 * `NextActivity.rationale.mastery_gaps` is documented as "Skill IDs where mastery
 * < 0.85" and `PracticeResult.mastery_updates[].gate_passed` as "Whether mastery
 * ≥ 0.85". The repository's `AGENTS.md` prose says ≥ 0.80; where the prose and the
 * contract disagree, the thing the API actually returns wins, and the UI must not
 * claim a skill is cleared when the server would not.
 */
export const MASTERY_GATE = 0.85;

export type MasteryBand = 'not_started' | 'emerging' | 'developing' | 'approaching' | 'mastered';

/** Guards against a `NaN`, a negative, or a `1.2` arriving from the wire. */
export function clampMastery(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 1);
}

export function isMasteryPassing(value: number): boolean {
  return clampMastery(value) >= MASTERY_GATE;
}

/**
 * Five bands, monotone, with the gate on a boundary so the top band means exactly
 * "the gate is passed" — a colour that says *mastered* while `gate_passed` is false
 * would be a lie the UI tells on its own.
 */
export function masteryBand(value: number): MasteryBand {
  const mastery = clampMastery(value);
  if (mastery <= 0) return 'not_started';
  if (mastery < 0.5) return 'emerging';
  if (mastery < 0.7) return 'developing';
  if (mastery < MASTERY_GATE) return 'approaching';
  return 'mastered';
}
