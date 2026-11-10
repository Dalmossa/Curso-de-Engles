import {
  resolveActivityDestination,
  summarizeMastery,
  unknownGaps,
  type ActivityDestination,
  type CefrLevel,
  type CurriculumRepository,
  type LearnerPreferences,
  type LearnerRepository,
  type MasteryOverview,
  type NextActivity,
  type NextActivityContext,
} from '@/core';

/**
 * Everything the dashboard shows, assembled in one place.
 *
 * The dashboard deliberately reads `profile.mastery` rather than calling
 * `/learners/{id}/mastery`: the two carry the same BKT probabilities, and the extra
 * endpoint adds only `gate_passed` (recomputed here from the gate the contract
 * publishes) and `last_practice` (which the mastery screen shows, not the dashboard).
 * One request instead of two on the first screen after login.
 */
export interface LearnerDashboard {
  readonly learnerId: string;
  readonly cefrLevel: CefrLevel | null;
  readonly mastery: MasteryOverview;
  readonly nextActivity: NextActivity;
  readonly destination: ActivityDestination;
  /**
   * Skill ids the rationale named as gaps but that the learner's profile does not
   * carry. Normally empty; non-empty means the two endpoints disagree, which the UI
   * surfaces rather than hides (a silent mismatch is how the mastery screen and the
   * recommendation card end up contradicting each other on screen).
   */
  readonly unexplainedGaps: readonly string[];
  readonly preferences: LearnerPreferences;
  readonly dailyGoalMinutes: number;
}

export class GetLearnerDashboard {
  constructor(
    private readonly learners: LearnerRepository,
    private readonly curriculum: CurriculumRepository,
  ) {}

  async execute(learnerId: string, context?: NextActivityContext): Promise<LearnerDashboard> {
    // Independent requests: the profile does not inform which activity to fetch
    // (the server decides that from its own learner model), so serialising them would
    // only add latency to the slowest screen in the app.
    const [profile, nextActivity] = await Promise.all([
      this.learners.getProfile(learnerId),
      this.curriculum.getNextActivity(learnerId, context),
    ]);

    return {
      learnerId: profile.learnerId,
      cefrLevel: profile.cefrLevel,
      mastery: summarizeMastery(profile.mastery),
      nextActivity,
      destination: resolveActivityDestination(nextActivity),
      unexplainedGaps: unknownGaps(nextActivity.rationale.masteryGaps, profile.mastery),
      preferences: profile.preferences,
      dailyGoalMinutes: profile.preferences.dailyGoalMinutes,
    };
  }
}
