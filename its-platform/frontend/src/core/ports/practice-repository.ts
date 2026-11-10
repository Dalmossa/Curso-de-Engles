import type { PracticeResult, PracticeSubmissionInput } from '../entities/practice';

/**
 * `POST /learners/{learner_id}/practice`.
 *
 * This is the **only** source of per-item correctness. The pack payload deliberately
 * does not carry a key (ADR-044), so `scored_items[].correct` is the first moment the
 * UI can know an answer — and the only moment it may say so.
 */
export interface PracticeRepository {
  submit(learnerId: string, submission: PracticeSubmissionInput): Promise<PracticeResult>;
}
