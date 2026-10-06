/**
 * Domain entities — learner model (contexts 4, 8) and its aggregates.
 * Pure TypeScript, no framework imports (ADR-014).
 *
 * gate_passed does not exist here either: the mastery gate (L-2) is a domain
 * FUNCTION over the evidence, never a stored column (ADR-018 invariant floor;
 * enforced by P1.2 in src/domain/).
 */

export type FsrsStateName = 'new' | 'learning' | 'review' | 'relearning';
export type FsrsGrade = 1 | 2 | 3 | 4;

export class Learner {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly lastActiveAt: Date | null,
    public readonly updatedAt: Date,
  ) {}
}

export class LearnerMastery {
  constructor(
    public readonly learnerId: string,
    public readonly skillId: string,
    public readonly pKnow: number,
    public readonly nObs: number,
    public readonly distinctDays: number,
    public readonly spacedObs: number,
    public readonly lastPracticeAt: Date | null,
    public readonly updatedAt: Date,
  ) {}
}

export class ThetaEstimate {
  constructor(
    public readonly learnerId: string,
    public readonly skillId: string,
    public readonly theta: number,
    public readonly se: number,
    public readonly ci95Lower: number,
    public readonly ci95Upper: number,
    public readonly evidenceCount: number,
    public readonly lastUpdated: Date,
  ) {}
}

export class FsrsState {
  constructor(
    public readonly learnerId: string,
    public readonly itemId: string,
    public readonly stability: number,
    public readonly difficulty: number,
    public readonly state: FsrsStateName,
    public readonly grade: FsrsGrade | null,
    public readonly hintUsed: boolean,
    public readonly lastReview: Date,
    public readonly dueDate: Date,
    public readonly wVersion: string,
    public readonly updatedAt: Date,
  ) {}
}

export type ErrorPattern =
  | 'null_subject'
  | 'eventually'
  | 'responsible_of'
  | 'th_stopped'
  | 'w_v_interference'
  | 'false_cognate_activated'
  | 'spelling_no_epenthetic_vowel'
  | 'article_omission';

/** ADR-015 §4 / domain-model §4.1: the observation, not the prediction. */
export class ErrorLogEntry {
  constructor(
    public readonly id: string,
    public readonly learnerId: string,
    public readonly skillId: string,
    public readonly pattern: ErrorPattern,
    public readonly producedForm: string,
    public readonly frequency: number,
    public readonly severity: number,
    public readonly firstSeenAt: Date,
    public readonly lastSeenAt: Date,
  ) {}
}

export type AffectiveKind =
  | 'skip_streak'
  | 'hint_seeking'
  | 'session_abandon'
  | 'time_on_task_spike'
  | 'rapid_guessing';

/** domain-model §4.3: recorded so curriculum-graph §11's input exists; deliberately unread in MVP selection. */
export class AffectiveSignal {
  constructor(
    public readonly id: string,
    public readonly learnerId: string,
    public readonly kind: AffectiveKind,
    public readonly observedAt: Date,
    public readonly strength: number,
  ) {}
}