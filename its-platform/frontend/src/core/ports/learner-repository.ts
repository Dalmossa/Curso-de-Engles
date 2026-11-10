import type { LearnerProfile, SkillMastery } from '../entities/learner';

/**
 * `GET /learners/{learner_id}/profile` and `/mastery`.
 *
 * `learnerId` is an explicit parameter rather than something the implementation reads
 * from an ambient session, which keeps the use cases pure and testable. Resolving the
 * id is `infrastructure`'s job (`identity/`), and it happens server-side: the browser
 * never supplies a learner id, so it cannot ask for another learner's data.
 */
export interface LearnerRepository {
  getProfile(learnerId: string): Promise<LearnerProfile>;
  /** Returns one entry per skill the learner has, in no guaranteed order. */
  getMastery(learnerId: string): Promise<readonly SkillMastery[]>;
}
