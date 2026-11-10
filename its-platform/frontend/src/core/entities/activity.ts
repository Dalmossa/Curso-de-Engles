/** `NextActivity.activity_type` — the contract's enum, verbatim. */
export type ActivityType = 'lesson' | 'practice_pack' | 'listening' | 'review';

/** Why this activity was chosen. Rendered to the learner, so the wording matters. */
export type SelectionRule = 'mastery_gate' | 'prerequisite' | 'spaced_review' | 'diagnostic_followup';

export interface ActivityRationale {
  readonly selectionRule: SelectionRule;
  /** Skill ids where mastery < 0.85, per the contract. */
  readonly masteryGaps: readonly string[];
  /** Whether the activity sits at i+1 (Krashen). */
  readonly iPlus1: boolean;
}

/**
 * `GET /learners/{id}/next`.
 *
 * `estimated_duration_minutes` and `prerequisites_met` are optional in the contract,
 * so they are `null` here rather than defaulted: "unknown" and "30 minutes" are
 * different claims, and only one of them is ours to make.
 */
export interface NextActivity {
  readonly activityType: ActivityType;
  readonly activityId: string;
  readonly rationale: ActivityRationale;
  readonly estimatedDurationMinutes: number | null;
  readonly prerequisitesMet: boolean | null;
}

export type DeviceType = 'mobile' | 'desktop' | 'tablet';

/** The optional selection context the endpoint accepts as query parameters. */
export interface NextActivityContext {
  readonly timeBudgetMinutes?: number;
  readonly device?: DeviceType;
}
