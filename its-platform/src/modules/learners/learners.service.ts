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
 *
 * **LGPD Art. 18 (P1.15/P1.16)** — `exportData` and `eraseData` implement the statutory rights
 * of access/portability and erasure. Both require explicit scopes (`learner:export`,
 * `learner:erase`) per ADR-038 D2, and both run under `withVisible` so the RLS policy decides
 * visibility. `eraseData` runs in the same transaction that verified visibility, ensuring the
 * deletion is atomic with the visibility check (ADR-026 §1).
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

  /**
   * LGPD Art. 18 II/V — Right to access and portability.
   *
   * Returns all personal data the platform holds for the learner in a structured,
   * machine-readable JSON format. Includes profile, mastery, diagnostic history,
   * practice history, FSRS states, and consent records.
   *
   * Runs under `withVisible` so RLS policy enforces learner isolation.
   */
  async exportData(subject: string, learnerId: string) {
    return this.learnerScope.withVisible(subject, learnerId, async (learner, tx) => {
      const sources = await this.profile.read(learner.id, tx);

      // Diagnostic results
      const diagnosticResults = (await tx.query(
        `SELECT id, cefr, theta_estimate, skill_theta, form_version, completed_at, created_at
         FROM diagnostic_results WHERE learner_id = $1 ORDER BY created_at DESC`,
        [learner.id],
      )) as Array<{
        id: string;
        cefr: string;
        theta_estimate: string;
        skill_theta: object;
        form_version: string;
        completed_at: Date;
        created_at: Date;
      }>;

      // Practice attempts
      const practiceAttempts = (await tx.query(
        `SELECT id, pack_id, score, correct_count, total_count, started_at, completed_at
         FROM practice_attempts WHERE learner_id = $1 ORDER BY started_at DESC`,
        [learner.id],
      )) as Array<{
        id: string;
        pack_id: string;
        score: number;
        correct_count: number;
        total_count: number;
        started_at: Date;
        completed_at: Date | null;
      }>;

      // Consent records
      const consentRecords = (await tx.query(
        `SELECT purpose, version, granted_at, withdrawn_at, legal_basis, created_at
         FROM consent_records WHERE learner_id = $1 ORDER BY created_at DESC`,
        [learner.id],
      )) as Array<{
        purpose: string;
        version: string;
        granted_at: Date | null;
        withdrawn_at: Date | null;
        legal_basis: string;
        created_at: Date;
      }>;

      return {
        learner: {
          learner_id: learner.id,
          created_at: learner.created_at.toISOString(),
          last_active_at: learner.last_active_at?.toISOString() ?? null,
        },
        profile: {
          cefr_level: sources.cefr,
          mastery: sources.mastery,
          theta_estimates: {},
          fsrs_states: sources.fsrsStates,
          preferences: {
            recast_enabled: true,
            meta_button_enabled: true,
            audio_autoplay: false,
            daily_goal_minutes: 15,
          },
        },
        diagnostics: diagnosticResults.map(d => ({
          id: d.id,
          cefr: d.cefr,
          theta_estimate: Number(d.theta_estimate),
          skill_theta: d.skill_theta,
          form_version: d.form_version,
          completed_at: d.completed_at.toISOString(),
        })),
        practice: practiceAttempts.map(p => ({
          id: p.id,
          pack_id: p.pack_id,
          score: p.score,
          correct_count: p.correct_count,
          total_count: p.total_count,
          started_at: p.started_at.toISOString(),
          completed_at: p.completed_at?.toISOString() ?? null,
        })),
        consents: consentRecords.map(c => ({
          purpose: c.purpose,
          version: c.version,
          granted_at: c.granted_at?.toISOString() ?? null,
          withdrawn_at: c.withdrawn_at?.toISOString() ?? null,
          legal_basis: c.legal_basis,
        })),
        exported_at: new Date().toISOString(),
      };
    });
  }

  /**
   * LGPD Art. 18 IV/VI — Right to erasure (right to be forgotten).
   *
   * Deletes all personal data the platform holds for the learner. Runs in the same
   * transaction that verified visibility (via `withVisible`), so the RLS policy
   * guarantees the caller can only erase their own data. The deletion is atomic
   * with the visibility check (ADR-026 §1).
   *
   * Order of deletion respects FK constraints:
   * 1. Child tables (practice_attempts, diagnostic_results, etc.)
   * 2. Learner-scoped tables (mastery, fsrs_states, etc.)
   * 3. Consent records
   * 4. Learner row (last)
   */
  async eraseData(subject: string, learnerId: string): Promise<void> {
    await this.learnerScope.withVisible(subject, learnerId, async (learner, tx) => {
      // Delete in FK-safe order (children first)
      await tx.query(`DELETE FROM practice_attempts WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM diagnostic_results WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM diagnostic_responses WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM listening_attempts WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM slot_responses WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM item_responses WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM learner_mastery WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM theta_estimates WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM fsrs_states WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM error_log WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM affective_signals WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM append_only_events WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM consent_records WHERE learner_id = $1`, [learner.id]);
      await tx.query(`DELETE FROM user_sessions WHERE learner_id = $1`, [learner.id]);
      // Finally delete the learner row
      await tx.query(`DELETE FROM learners WHERE id = $1`, [learner.id]);
    });
  }
}
