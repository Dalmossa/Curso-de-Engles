/**
 * The learner's own portfolio — `GET /learners/{learner_id}/profile` and `…/mastery`.
 *
 * A5b changed what happens **before** the body, not the body. Every handler here now resolves the
 * addressed learner through `LearnerScopeService`, which performs the one read ADR-038 D3 governs:
 * the row is loaded inside a transaction whose learner context is the token's `sub` (ADR-026 §1),
 * so a row that belongs to someone else is not returned at all and the request answers 404 with the
 * same body a nonexistent id gets — decided by ADR-003's policy, never by comparing two identifiers.
 *
 * The bodies are still the stubs they were, and that is the ratified scope rather than an
 * oversight: a human chose *"mínimo: só a leitura que a RLS governa"* for A5b, and the aggregation
 * these two routes publish — per-skill mastery, θ estimates, FSRS states, preferences, streak — is
 * P1.10/P1.11's work. What is implemented here is that neither route can be answered for a learner
 * the caller cannot see.
 *
 * The profile's `learner_id` is the one member read off the loaded row, and it is the same string
 * the path carried: the query answered `WHERE id = $1` under the policy, so the row that came back
 * *is* the addressed id. Every other member stays the stub's, on purpose — a body that mixed a real
 * value with an invented one would make it impossible to tell which half to trust.
 */

import { Injectable } from '@nestjs/common';

import { LearnerScopeService } from './learner-scope.service.js';

@Injectable()
export class LearnersService {
  constructor(private readonly learnerScope: LearnerScopeService) {}

  async getProfile(subject: string, learnerId: string) {
    const learner = await this.learnerScope.requireVisible(subject, learnerId);

    return {
      learner_id: learner.id,
      created_at: new Date().toISOString(),
      cefr_level: 'A2',
      mastery: { grammar: 0.5, vocab: 0.5 },
      theta_estimates: {},
      fsrs_states: {},
      preferences: {
        recast_enabled: true,
        meta_button_enabled: true,
        audio_autoplay: false,
        daily_goal_minutes: 20,
      },
      streak_days: 0,
      xp: 0,
    };
  }

  async getMastery(subject: string, learnerId: string) {
    // The load is the whole of A5b's change to this route; the body below is the stub, unchanged.
    // It carries no `learner_id`: the contract declares this response as a bare map of skills
    // (`additionalProperties` → `{mastery, gate_passed, last_practice}`), so an extra string member
    // would be a contract violation rather than information. The id the caller asked for is the id
    // it already has in the path.
    await this.learnerScope.requireVisible(subject, learnerId);

    return {
      grammar: { mastery: 0.5, gate_passed: false, last_practice: new Date().toISOString() },
      vocab: { mastery: 0.5, gate_passed: false, last_practice: new Date().toISOString() },
    };
  }
}
