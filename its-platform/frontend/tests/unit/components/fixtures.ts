/**
 * Fixtures for the presentation component tests.
 *
 * Hand-written rather than copied from a live response, because the point of these
 * fixtures is to be *small enough to read* and to say exactly what the component under
 * test is allowed to know. In particular, `PackContent.items[].options[]` carries no
 * member that could identify the key (ADR-044) — a fixture that carried one would make
 * the answer-key tests pass for the wrong reason.
 *
 * `deriveFeedback` is the real application-layer mapper, not a stub: the feedback
 * fixtures are built from a `PracticeResult` so the tests exercise the production
 * translation from `scored_items[].correct` to a verdict.
 */
import { deriveFeedback, type PracticeFeedback } from '@/application/use-cases/submit-practice';
import type {
  AssessmentItem,
  LessonContent,
  LessonPhase,
  PackContent,
  PracticeResult,
  ScoredItem,
} from '@/core';

/* ------------------------------------------------------------------ practice items */

/** One distinct option text per item, so a wrong highlight is immediately visible. */
const GRAMMAR_OPTIONS = [
  { letter: 'A', text: 'I am agree with you.', brPtForm: null },
  { letter: 'B', text: 'I agree with you.', brPtForm: null },
  { letter: 'C', text: 'I agreeing with you.', brPtForm: null },
] as const;

const VOCAB_OPTIONS = [
  { letter: 'A', text: 'a bug', brPtForm: 'um defeito' },
  { letter: 'B', text: 'a deploy', brPtForm: 'uma implantação' },
  { letter: 'C', text: 'a deadline', brPtForm: 'um prazo' },
] as const;

/**
 * The key is `B` in both choice items, deliberately: a component that highlighted the
 * first option, or the one whose text sorted first, would still pass a fixture whose key
 * was always `A`.
 */
export const GRAMMAR_ITEM: AssessmentItem = {
  itemId: 'item_grammar_1',
  itemType: 'gap_fill',
  skill: 'grammar',
  domain: 'verb_patterns',
  prompt: 'Choose the sentence that is correct in standard English.',
  scoring: 'choice',
  options: GRAMMAR_OPTIONS,
};

export const VOCAB_ITEM: AssessmentItem = {
  itemId: 'item_vocab_1',
  itemType: 'definition_match',
  skill: 'vocab',
  domain: 'it_workplace',
  prompt: 'Which term means "a fault in the software"?',
  scoring: 'choice',
  options: VOCAB_OPTIONS,
};

export const PRODUCTION_ITEM: AssessmentItem = {
  itemId: 'item_production_1',
  itemType: 'production',
  skill: 'coherence',
  domain: null,
  prompt: 'Describe your daily routine in two sentences.',
  scoring: 'free_text',
  options: [],
};

/** `options: []` by design for this mode — see `isChoiceAnswerable`. */
export const PRONUNCIATION_ITEM: AssessmentItem = {
  itemId: 'item_pronunciation_1',
  itemType: 'minimal_pair',
  skill: 'pronunciation',
  domain: 'th_sound',
  prompt: 'Say the minimal pair out loud.',
  scoring: 'asr_phoneme_match',
  options: [],
};

export const PACK: PackContent = {
  packId: 'pack_les_a2_greetings_v1',
  lessonId: 'les_a2_greetings',
  schemaVersion: 'canonical',
  reuseBasis: 'cite_only',
  items: [GRAMMAR_ITEM, VOCAB_ITEM],
};

export const PACK_WITH_PRODUCTION: PackContent = {
  ...PACK,
  items: [PRODUCTION_ITEM, PRONUNCIATION_ITEM, GRAMMAR_ITEM],
};

/* --------------------------------------------------------------------- practice result */

export function scoredItem(itemId: string, correct: boolean | null, skill = 'grammar'): ScoredItem {
  return {
    itemId,
    correct,
    skill,
    bktUpdate: { prior: 0.4, posterior: 0.55, transition: correct === true ? 'learned' : 'forgot' },
  };
}

export function practiceResult(packId: string, scoredItems: readonly ScoredItem[]): PracticeResult {
  return {
    packId,
    scoredItems,
    masteryUpdates: [{ skill: 'grammar', masteryBefore: 0.4, masteryAfter: 0.55, gatePassed: false }],
    nextReviewSchedule: [{ skill: 'grammar', nextReviewAt: '2026-10-25T10:00:00.000Z', intervalDays: 3 }],
  };
}

/** One item right, one wrong — the smallest result that exercises both tones. */
export const MIXED_FEEDBACK: PracticeFeedback = deriveFeedback(
  practiceResult(PACK.packId, [
    scoredItem(GRAMMAR_ITEM.itemId, true),
    scoredItem(VOCAB_ITEM.itemId, false, 'vocab'),
  ]),
);

export const ALL_CORRECT_FEEDBACK: PracticeFeedback = deriveFeedback(
  practiceResult(PACK.packId, [scoredItem(GRAMMAR_ITEM.itemId, true)]),
);

export const ALL_WRONG_FEEDBACK: PracticeFeedback = deriveFeedback(
  practiceResult(PACK.packId, [scoredItem(GRAMMAR_ITEM.itemId, false)]),
);

/** A production item the server has not graded yet (`correct: null`). */
export const PENDING_FEEDBACK: PracticeFeedback = deriveFeedback(
  practiceResult(PACK.packId, [
    scoredItem(GRAMMAR_ITEM.itemId, true),
    scoredItem(PRODUCTION_ITEM.itemId, null, 'coherence'),
  ]),
);

export const EMPTY_FEEDBACK: PracticeFeedback = deriveFeedback(practiceResult(PACK.packId, []));

/* ----------------------------------------------------------------------------- lesson */

function phases(count: number): readonly LessonPhase[] {
  const headings = ['Aquecimento', 'Entrada compreensível', 'Prática guiada', 'Tarefa de saída'];
  return headings.slice(0, count).map((heading, index) => ({
    phase: index + 1,
    heading,
    markdown: `Corpo da fase ${index + 1} com **destaque**.`,
  }));
}

export const LESSON_ID = 'les_a2_greetings';

export const PUBLISHABLE_LESSON: LessonContent = {
  lessonId: LESSON_ID,
  title: 'Greetings and introductions',
  cefrLevel: 'A2',
  reuseBasis: 'cite_only',
  authoringState: 'authored',
  publicationState: 'publishable',
  phases: phases(4),
  learnerModel: {
    target_skills: ['grammar', 'vocab'],
    i_plus_1: true,
  },
};

export const RESTRICTED_LESSON: LessonContent = {
  ...PUBLISHABLE_LESSON,
  reuseBasis: 'adapt_requires_permission',
  authoringState: 'blocked',
  publicationState: 'restricted_pending_permission',
};

/** 1 of the 122 lessons declares no `DADOS PARA O LEARNER MODEL` block. */
export const LESSON_WITHOUT_LEARNER_MODEL: LessonContent = {
  ...PUBLISHABLE_LESSON,
  learnerModel: null,
};
