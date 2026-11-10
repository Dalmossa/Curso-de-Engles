import type { CefrLevel } from '../value-objects/cefr-level';

/**
 * `LearnerProfile` as the UI needs it.
 *
 * Deliberately narrower than the generated DTO: `theta_estimates` and `fsrs_states`
 * are not carried, because ADR-043 R1 keeps raw θ and `se` out of public surfaces
 * and no screen in this slice shows an FSRS state. Dropping them at the boundary is
 * what makes "the UI cannot leak θ" a property of the type rather than a promise.
 */
export interface LearnerPreferences {
  readonly recastEnabled: boolean;
  readonly metaButtonEnabled: boolean;
  readonly audioAutoplay: boolean;
  readonly dailyGoalMinutes: number;
}

export interface LearnerProfile {
  readonly learnerId: string;
  /** ISO 8601. */
  readonly createdAt: string;
  /** `null` while no diagnostic has been completed — "not yet assessed". */
  readonly cefrLevel: CefrLevel | null;
  readonly mastery: Readonly<Record<string, number>>;
  readonly preferences: LearnerPreferences;
}

/** One row of `GET /learners/{id}/mastery`. */
export interface SkillMastery {
  readonly skill: string;
  readonly mastery: number;
  readonly gatePassed: boolean;
  /** ISO 8601, or `null` when the member was absent. */
  readonly lastPractice: string | null;
}
