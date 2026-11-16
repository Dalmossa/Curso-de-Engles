import type { Skill } from '../value-objects/skill';

/**
 * `items.scoring` — and it is load-bearing for the UI, not decoration.
 *
 * `asr_phoneme_match` items carry **no options by design** (6 of 847), so without
 * this member an `options: []` is indistinguishable from a malformed item. It is
 * also what replaced `key` as the signal: ADR-044 removed the key, not the
 * distinction.
 */
export type ScoringMode = 'choice' | 'free_text' | 'asr_phoneme_match';

/** `PackContent.items[].item_type` — the DDL CHECK vocabulary. */
export type ItemType =
  | 'gap_fill'
  | 'error_correction'
  | 'form_selection'
  | 'definition_match'
  | 'register_selection'
  | 'scanning'
  | 'cloze'
  | 'matching'
  | 'ordering'
  | 'contextual_selection'
  | 'minimal_pair'
  | 'production';

/**
 * `PackOption` and the ADR-044 rule that governs everything rendered from it:
 *
 * `options` is **the complete set**. The key option is among the entries and carries
 * nothing that marks it — `is_key` and `note` are not published at all, precisely
 * because their absence was the only thing that made an option not obviously the
 * answer. There is therefore no field in this type that can identify the key, and
 * the UI must not compute one either: feedback comes from `POST .../practice`
 * (`scored_items[].correct`), never from the payload it is about to answer.
 */
export interface PackOption {
  readonly letter: string;
  readonly text: string;
  /**
   * Present only when **every** option of the item carries a gloss — 798 of 841
   * items. It cannot be published per option, because a gloss present on some
   * options and absent from others points at the one it is missing from (measured:
   * 17 items, and the gloss-less option was the key in all 17).
   */
  readonly brPtForm: string | null;
}

export interface AssessmentItem {
  readonly itemId: string;
  readonly itemType: ItemType;
  readonly skill: Skill;
  readonly domain: string | null;
  readonly prompt: string;
  readonly scoring: ScoringMode;
  readonly options: readonly PackOption[];
}

export interface PackContent {
  readonly packId: string;
  readonly lessonId: string;
  readonly schemaVersion: 'canonical' | 'legacy_v1';
  readonly reuseBasis: 'cite_only' | 'adapt_with_attribution' | 'adapt_requires_permission' | 'authored_material' | null;
  readonly items: readonly AssessmentItem[];
}

/** One entry of `PracticeSubmission.responses`. */
export interface PracticeResponseInput {
  readonly itemId: string;
  readonly response: string | { readonly transcript?: string; readonly audioRef?: string };
  readonly responseTimeMs: number;
  readonly confidence?: number;
}

export interface PracticeSubmissionInput {
  readonly packId: string;
  readonly responses: readonly PracticeResponseInput[];
}

export type BktTransition = 'learned' | 'retained' | 'forgot' | 'guessed';

export interface ScoredItem {
  readonly itemId: string;
  /**
   * `null` for production items scored asynchronously. The *documented* behaviour is
   * a nullable result; the *declared* schema is a plain `boolean`, so the value is
   * widened here and the UI renders the null case as "pending" rather than as a
   * wrong answer. Reported to `api-developer` as a schema/description mismatch.
   */
  readonly correct: boolean | null;
  readonly skill: string;
  readonly bktUpdate: {
    readonly prior: number;
    readonly posterior: number;
    readonly transition: BktTransition;
  };
}

export interface MasteryUpdate {
  readonly skill: string;
  readonly masteryBefore: number;
  readonly masteryAfter: number;
  readonly gatePassed: boolean;
}

export interface ReviewScheduleEntry {
  readonly skill: string;
  readonly nextReviewAt: string;
  readonly intervalDays: number;
}

export interface PracticeResult {
  readonly packId: string;
  readonly scoredItems: readonly ScoredItem[];
  readonly masteryUpdates: readonly MasteryUpdate[];
  readonly nextReviewSchedule: readonly ReviewScheduleEntry[];
}
