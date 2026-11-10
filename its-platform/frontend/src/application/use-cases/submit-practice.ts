import type {
  ContentRepository,
  PackContent,
  PracticeRepository,
  PracticeResponseInput,
  PracticeResult,
} from '@/core';

export interface PracticeScreenData {
  readonly pack: PackContent;
  /** The lesson the pack belongs to, as the API reports it. */
  readonly lessonId: string;
}

export class GetPracticePack {
  constructor(private readonly content: ContentRepository) {}

  async execute(packId: string): Promise<PracticeScreenData> {
    const pack = await this.content.getPack(packId);
    return { pack, lessonId: pack.lessonId };
  }
}

export interface PracticeFeedback {
  readonly result: PracticeResult;
  readonly correctItemIds: readonly string[];
  readonly incorrectItemIds: readonly string[];
  /**
   * Items the server scored asynchronously: `correct` is documented as null for
   * production items. They are neither right nor wrong yet, and counting them as wrong
   * would understate the learner's mastery on screen.
   */
  readonly pendingItemIds: readonly string[];
  readonly score: { readonly graded: number; readonly correct: number };
}

/**
 * Submits a pack and derives what the feedback surface needs.
 *
 * `scored_items[].correct` is the first and only disclosure of an answer key in the
 * entire flow — which is exactly why the mapping happens here, in the application
 * layer, rather than in a component that also has the pre-submission payload in scope
 * (ADR-044).
 */
export class SubmitPractice {
  constructor(private readonly practice: PracticeRepository) {}

  async execute(
    learnerId: string,
    packId: string,
    responses: readonly PracticeResponseInput[],
  ): Promise<PracticeFeedback> {
    const result = await this.practice.submit(learnerId, { packId, responses });
    return deriveFeedback(result);
  }
}

export function deriveFeedback(result: PracticeResult): PracticeFeedback {
  const correctItemIds: string[] = [];
  const incorrectItemIds: string[] = [];
  const pendingItemIds: string[] = [];

  for (const item of result.scoredItems) {
    if (item.correct === null) pendingItemIds.push(item.itemId);
    else if (item.correct) correctItemIds.push(item.itemId);
    else incorrectItemIds.push(item.itemId);
  }

  return {
    result,
    correctItemIds,
    incorrectItemIds,
    pendingItemIds,
    score: { graded: correctItemIds.length + incorrectItemIds.length, correct: correctItemIds.length },
  };
}

/** The verdict for one item, as the feedback list renders it. */
export type ItemVerdict = 'correct' | 'incorrect' | 'pending' | 'unscored';

export function verdictFor(itemId: string, feedback: PracticeFeedback): ItemVerdict {
  if (feedback.pendingItemIds.includes(itemId)) return 'pending';
  if (feedback.correctItemIds.includes(itemId)) return 'correct';
  if (feedback.incorrectItemIds.includes(itemId)) return 'incorrect';
  return 'unscored';
}
