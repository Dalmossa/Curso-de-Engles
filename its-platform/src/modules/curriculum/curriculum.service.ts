/**
 * `GET /learners/{learner_id}/next` — the i+1 selection.
 *
 * A5b's change to this route is the same one every learner-scoped route got, and it is entirely
 * before the body: the addressed learner is resolved under the caller's own RLS context
 * (`LearnerScopeService`), so a request that addresses another learner's id answers 404 — the
 * policy returned no row — instead of an activity recommendation. The recommendation itself stays
 * the stub it was: `NextActivity`'s selection logic is the adaptive engine's work, and A5b's
 * ratified scope is *"only the read the RLS governs"*.
 *
 * `query` is still `any` and still unread. Narrowing it would be a contract change of its own
 * (`getNextActivity` declares query parameters the controller never validated), and inventing a
 * rule for it here would hide a real gap behind a DTO nobody asked for.
 */

import { Injectable } from '@nestjs/common';

import { LearnerScopeService } from '../learners/learner-scope.service.js';

@Injectable()
export class CurriculumService {
  constructor(private readonly learnerScope: LearnerScopeService) {}

  async getNextActivity(subject: string, learnerId: string, query: unknown) {
    await this.learnerScope.requireVisible(subject, learnerId);

    return {
      activity_type: 'lesson',
      activity_id: 'les_a2_airport',
      rationale: {
        selection_rule: 'prerequisite',
        mastery_gaps: [],
        i_plus_1: true,
      },
      estimated_duration_minutes: 15,
      prerequisites_met: true,
    };
  }
}
