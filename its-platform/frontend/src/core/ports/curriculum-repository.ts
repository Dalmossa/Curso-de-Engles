import type { NextActivity, NextActivityContext } from '../entities/activity';

/** `GET /learners/{learner_id}/next` — i+1 selection with its rationale. */
export interface CurriculumRepository {
  getNextActivity(learnerId: string, context?: NextActivityContext): Promise<NextActivity>;
}
