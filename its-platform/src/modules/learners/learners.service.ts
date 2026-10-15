/**
 * The learner's own portfolio — `GET /learners/{learner_id}/profile` and `…/mastery`.
 *
 * A5b changed what happens **before** the body, not the body. Every handler here resolves the
 * addressed learner through `LearnerScopeService`, which performs the one read ADR-038 D3 governs:
 * the row is loaded inside a transaction whose learner context is the token's `sub` (ADR-026 §1),
 * so a row that belongs to someone else is not returned at all and the request answers 404 with the
 * same body a nonexistent id gets — decided by ADR-003's policy, never by comparing two identifiers.
 *
 * **A7b closed the profile, and only the profile** (ADR-045 D1). `getProfile` no longer *builds* its
 * members: `learner_id` and `created_at` are the loaded row's; `cefr_level` is the `cefr` of the
 * learner's latest completed run; `mastery` and `fsrs_states` are read from the tables that own them
 * — through the very transaction the 404 was decided in (`withVisible`), so the policy covers the
 * aggregate and not just the row. `preferences` is the one member no table can answer, and it
 * answers the document's own `default:`s, because preferences without a store *are* the domain
 * default (ERD §10, D5). `xp` and `streak_days` are gone from the body **and** from the contract:
 * no artefact can answer them (ADR-015 §3, `data-model.erd.md` §6.5), and `0` is indistinguishable
 * from a fact to any client (D4).
 *
 * `theta_estimates` is the member this file **holds**, and that is a decision rather than a
 * leftover: ADR-045 D6 holds it until ADR-043 R1 (H3) ratifies whether θ and its `se` leave the
 * public API at all. Serving `{}` while the table holds an estimate is therefore not a stub that
 * nobody got to — it is the shape of a question that has been asked and not yet answered, and the
 * pin records it as the one assertion H3's ratification inverts.
 *
 * `getMastery` is untouched and is still a stub on purpose: it is A7c's, with the `gate_passed`
 * verdict the domain computes. Which route closes in which sub-phase is ADR-045 D1's decomposition,
 * and a body that mixed one corrected member with five invented ones would make it impossible to
 * tell which half to trust — the same reason A5b left all five bodies alone.
 */

import { Injectable } from '@nestjs/common';

import { LearnerProfileRepository } from '../../infrastructure/repositories/learner-profile.repository.js';
import { LearnerScopeService } from './learner-scope.service.js';

/**
 * The four preference defaults, and their only source is the contract: `LearnerProfile.preferences`
 * in `docs/api-spec.openapi.yaml` (ADR-045 D5). `learner_preferences` was removed (ERD §10)
 * precisely because preferences without a spec *are* the domain default, so the declaration is where
 * that default lives and this constant is a transcription of it — a value here that differed from
 * the document would be indistinguishable from a stored preference, which is the one thing a client
 * cannot check for itself. `tests/integration/learner-routes-bodies.spec.ts` reads the document and
 * asserts this object equals what it declares, member for member.
 */
const DOMAIN_PREFERENCES = {
  recast_enabled: true,
  meta_button_enabled: true,
  audio_autoplay: false,
  daily_goal_minutes: 15,
};

@Injectable()
export class LearnersService {
  constructor(
    private readonly learnerScope: LearnerScopeService,
    private readonly profile: LearnerProfileRepository,
  ) {}

  /**
   * The learner's own portfolio, member by member from the artefact that owns it (ADR-045 D2).
   *
   * Everything is read inside `withVisible`, so nothing here is fetched with a connection that
   * carries no learner context: the aggregate is covered by the same policy, and a learner the
   * caller cannot see is refused before the first of these reads.
   */
  async getProfile(subject: string, learnerId: string) {
    return this.learnerScope.withVisible(subject, learnerId, async (learner, tx) => {
      const sources = await this.profile.read(learner.id, tx);

      return {
        learner_id: learner.id,
        created_at: learner.created_at.toISOString(),
        // `string | null`: no completed run means "not yet assessed", which the contract now admits
        // (`type: [string, 'null']`) rather than answering a band the learner does not have (D3).
        cefr_level: sources.cefr,
        mastery: sources.mastery,
        // Held, not forgotten — see the header and ADR-043 R1.
        theta_estimates: {},
        fsrs_states: sources.fsrsStates,
        preferences: DOMAIN_PREFERENCES,
      };
    });
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
