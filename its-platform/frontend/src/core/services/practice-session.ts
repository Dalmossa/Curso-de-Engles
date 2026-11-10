import type { AssessmentItem, PackOption, PracticeResponseInput } from '../entities/practice';

/**
 * What the learner has done to one item so far, held in the browser only.
 *
 * The selected letter starts `null` — never the first option, never a default. A
 * pre-selected answer is an answer, and the whole point of ADR-044 is that the payload
 * the learner is looking at must not disclose which option is correct.
 */
export interface PracticeAnswerDraft {
  readonly itemId: string;
  readonly selectedLetter: string | null;
  readonly transcript: string | null;
  readonly responseTimeMs: number;
}

export function emptyDraft(itemId: string): PracticeAnswerDraft {
  return { itemId, selectedLetter: null, transcript: null, responseTimeMs: 0 };
}

/**
 * An item is answerable by clicking an option when it has options and is not scored by
 * speech. `asr_phoneme_match` items carry `options: []` *by design* (6 of 847), so
 * `options.length === 0` alone would mislabel those six as malformed.
 */
export function isChoiceAnswerable(item: AssessmentItem): boolean {
  return item.scoring === 'choice' && item.options.length > 0;
}

/** Scored from a typed or recorded production response rather than from a letter. */
export function isProductionAnswerable(item: AssessmentItem): boolean {
  return item.scoring === 'free_text' || item.scoring === 'asr_phoneme_match';
}

export function isAnswered(item: AssessmentItem, draft: PracticeAnswerDraft | undefined): boolean {
  if (!draft) return false;
  if (isChoiceAnswerable(item)) return draft.selectedLetter !== null;
  if (isProductionAnswerable(item)) return (draft.transcript ?? '').trim() !== '';
  return false;
}

export function unansweredItemIds(
  items: readonly AssessmentItem[],
  drafts: Readonly<Record<string, PracticeAnswerDraft>>,
): readonly string[] {
  return items.filter((item) => !isAnswered(item, drafts[item.itemId])).map((item) => item.itemId);
}

export interface SubmissionBuildOptions {
  /** Learner's self-reported confidence, per response. Omitted when `undefined`. */
  readonly confidence?: number;
}

/**
 * Builds the `responses[]` array for `POST /learners/{id}/practice`.
 *
 * Throws instead of submitting a partial set: the endpoint requires `minItems: 1` and
 * a half-submitted pack would score the omitted items as if the learner got them
 * wrong. Every member emitted here is one the submission schema declares, because the
 * DTO rejects a member it does not (`additionalProperties: false`).
 */
export function toSubmissionResponses(
  items: readonly AssessmentItem[],
  drafts: Readonly<Record<string, PracticeAnswerDraft>>,
  options: SubmissionBuildOptions = {},
): readonly PracticeResponseInput[] {
  const missing = unansweredItemIds(items, drafts);
  if (missing.length > 0) {
    throw new Error(`Cannot submit an incomplete pack: ${missing.length} item(s) unanswered.`);
  }

  return items.map((item) => {
    const draft = drafts[item.itemId];
    if (!draft) {
      // Unreachable: `unansweredItemIds` would have caught it first.
      throw new Error(`No answer recorded for item ${item.itemId}.`);
    }

    const responseTimeMs = Math.max(0, Math.round(draft.responseTimeMs));
    const confidence = options.confidence;

    // The letter only. Which letter is correct is not knowable here — and not knowable
    // from `options` either, since the key ships among them unmarked.
    const response: PracticeResponseInput['response'] = isChoiceAnswerable(item)
      ? (draft.selectedLetter ?? '')
      : { transcript: (draft.transcript ?? '').trim() };

    return {
      itemId: item.itemId,
      response,
      responseTimeMs,
      ...(confidence === undefined ? {} : { confidence }),
    };
  });
}

/**
 * ADR-044's rule in executable form: nothing in the pre-submission payload
 * distinguishes one option from another. The test suite asserts this over the pack
 * fixtures, so a field that identifies the key cannot quietly reappear.
 */
const KEY_REVEALING_FIELDS = ['is_key', 'key', 'note', 'distractor_type', 'distractors', 'correct'] as const;

export function optionsRevealKey(options: readonly PackOption[]): boolean {
  return options.some((option) =>
    KEY_REVEALING_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(option, field)),
  );
}
