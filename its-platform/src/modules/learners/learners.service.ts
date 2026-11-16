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
 *
 * **A identidade do aluno.** `display_name`, `email` e `avatar_url` moram na linha de `users` —
 * outro artefacto, outra tabela, outra chave (`learner_id`). O perfil os publica porque a
 * interface precisa reconhecê-lo (o cabeçalho global mostra nome, e-mail e avatar), e
 * `updateProfile` os escreve porque o mesmo learner precisa poder corrigir o próprio nome e a
 * própria foto. A tabela `users` não tem RLS — só `learners` tem — e por isso o predicado
 * `learner_id = $1` do repositório **é** a fronteira de isolamento, e não uma redundância.
 */

import { Injectable, NotFoundException } from '@nestjs/common';

import { LearnerProfileRepository } from '../../infrastructure/repositories/learner-profile.repository.js';
import { UserIdentityRepository } from '../../infrastructure/repositories/user-identity.repository.js';
import { LearnerScopeService } from './learner-scope.service.js';
import type { UpdateProfileDto } from './dto/update-profile.dto.js';

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
    private readonly identity: UserIdentityRepository,
  ) {}

  /**
   * The learner's own portfolio, member by member from the artefact that owns it (ADR-045 D2).
   *
   * Everything is read inside `withVisible`, so nothing here is fetched with a connection that
   * carries no learner context: the aggregate is covered by the same policy, and a learner the
   * caller cannot see is refused before the first of these reads.
   *
   * The three identity members (`display_name`, `email`, `avatar_url`) come from the `users` row,
   * which is a different artefact and a different table — read through `UserIdentityRepository`,
   * with its own explicit `learner_id = $1` predicate, because `users` carries no RLS policy of
   * its own.
   */
  async getProfile(subject: string, learnerId: string) {
    return this.learnerScope.withVisible(subject, learnerId, async (learner, tx) => {
      const sources = await this.profile.read(learner.id, tx);
      const identity = await this.identity.read(learner.id, tx);

      return {
        learner_id: learner.id,
        created_at: learner.created_at.toISOString(),
        // `string | null`: no completed run means "not yet assessed", which the contract now admits
        // (`type: [string, 'null']`) rather than answering a band the learner does not have (D3).
        cefr_level: sources.cefr,
        // The identity, as the `users` row holds it — `null` for a learner whose row was never
        // filled in, which is a state and not a failure.
        display_name: identity?.displayName ?? null,
        email: identity?.email ?? null,
        avatar_url: identity?.avatarUrl ?? null,
        mastery: sources.mastery,
        // Held, not forgotten — see the header and ADR-043 R1.
        theta_estimates: {},
        fsrs_states: sources.fsrsStates,
        preferences: DOMAIN_PREFERENCES,
      };
    });
  }

  /**
   * `PATCH /learners/{learner_id}/profile` — the learner updates their own name and avatar.
   *
   * The **same** `withVisible` gate as the read: the addressed learner is loaded inside the
   * caller's context first, and the write happens inside that very transaction — so a write to
   * somebody else's row is not "refused afterwards", it never happens. The `users` table carries
   * no RLS, which is why the repository repeats `learner_id = $1`: the gate above and the
   * predicate below are two halves of one rule, and neither is redundant.
   *
   * The response is the identity as it now stands, plus the band — so the caller can replace
   * everything it knows about the learner with one answer, without a second round trip to work
   * out whether the band moved.
   */
  async updateProfile(subject: string, learnerId: string, input: UpdateProfileDto) {
    return this.learnerScope.withVisible(subject, learnerId, async (learner, tx) => {
      const updated = await this.identity.update(
        learner.id,
        {
          ...(input.display_name === undefined ? {} : { displayName: input.display_name }),
          ...(input.avatar_url === undefined ? {} : { avatarUrl: input.avatar_url }),
        },
        tx,
      );

      if (updated === null) {
        // The learner exists (the gate above proved it) but has no account row to write to.
        // Creating one here would invent credentials; refusing is the honest answer.
        throw new NotFoundException('Learner account not found');
      }

      const sources = await this.profile.read(learner.id, tx);

      return {
        learner_id: learner.id,
        display_name: updated.displayName,
        email: updated.email,
        avatar_url: updated.avatarUrl,
        cefr_level: sources.cefr,
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
      //
      // **The aliases are not decoration — they are the difference between a 500 and a file.**
      // The table (`diagnostic_results`, migration 1791331200000) stores θ in `theta` and has **no**
      // `completed_at`: a run's completion *is* its `created_at`. The names the contract publishes
      // (`theta_estimate`, `completed_at`) are the *semantic* names, and the query translates the
      // schema into them — so the OpenAPI document stays exactly as it was published, and the
      // export finally returns the numbers it promises instead of failing on a column that was
      // never created.
      const diagnosticResults = (await tx.query(
        `SELECT id, cefr, theta AS theta_estimate, skill_theta, form_version,
                created_at AS completed_at, created_at
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
      //
      // `practice_attempts` stores `total_items` and `correct_count`; it has **no** `score` column,
      // because the score is a ratio and the table stores the two numbers it is made of. The export
      // publishes the ratio, and the ratio is computed here — with the zero case answered, because
      // an attempt with no items has no score to divide, and `0/0` is not a number a learner can read.
      const practiceAttempts = (await tx.query(
        `SELECT id, pack_id,
                CASE WHEN COALESCE(total_items, 0) > 0
                     THEN correct_count::float8 / total_items
                     ELSE 0 END AS score,
                correct_count,
                COALESCE(total_items, 0) AS total_count,
                started_at, completed_at
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
   * **Two statements, and the schema does the rest.** This used to enumerate every table
   * by hand, and each entry in that list was a way for the erasure to fail:
   *
   * 1. **`DELETE FROM append_only_events`** — the trigger `trg_append_only_guard` raises on
   *    any DELETE, and the application role is not even granted DELETE on the table. The
   *    refusal is correct: ADR-042 R3 rejects "erase = delete the log lines" **by name**.
   *    The log survives; the FK's `ON DELETE SET NULL` anonymises the link between the
   *    events and the person, and §4.6 keeps its proof.
   * 2. **`DELETE FROM consent_records` / `pronunciation_attempts`** — the application role
   *    holds no DELETE privilege on them (the consent trail is append-only by design), so
   *    the hand-written `DELETE` raised `permission denied` and rolled the whole erasure
   *    back. Their FKs to `learners(id)` are `ON DELETE CASCADE`, so the row's disappearance
   *    takes them with it — by the path the database sanctions, not by a path it forbids.
   * 3. **`DELETE FROM user_sessions WHERE learner_id = $1`** — there is no `learner_id` on
   *    that table; it hangs off `users`. A column error inside the transaction rolls back
   *    everything.
   * 4. **The account itself has to go.** The learner row holds the learning state; the
   *    e-mail and the password live in `users`. Erasing only the learner leaves a person
   *    who logs in again and is handed a fresh learner row by `ensureLearner` — which is
   *    not erasure, it is a reset with a delay. "Delete my account" has to delete the
   *    account.
   *
   * **Why the list is not written out.** Every learner-scoped table is declared in the
   * migration with `ON DELETE CASCADE` from `learners(id)` — that *is* the schema's answer
   * to "what depends on the learner", and it stays right when a table is added. A
   * hand-written list is a second answer that drifts from the first.
   */
  async eraseData(subject: string, learnerId: string): Promise<void> {
    await this.learnerScope.withVisible(subject, learnerId, async (learner, tx) => {
      // The account first. `users.learner_id` is a plain column — not a foreign key — so
      // nothing cascades *from* the learner into it; it has to be deleted by name. `id = $1`
      // is the legacy case, where the learner row *is* the user row (`ensureLearner` keys
      // the learner by the user id while the column is still NULL). Either way it is the
      // caller's own row, and the FK takes the sessions with it.
      //
      // **The casts are not decoration.** `users.learner_id` is `varchar` in the migration and
      // `uuid` in the deployed database; one parameter compared against both columns cannot
      // have two types, so the comparison is made in the one type both accept — text — and
      // the primary key keeps its own.
      await tx.query(`DELETE FROM users WHERE id = $1::uuid OR learner_id::text = $1::text`, [
        learner.id,
      ]);
      // Then the learner row. Everything else hangs off it by a foreign key with
      // `ON DELETE CASCADE` — except the append-only log, whose `ON DELETE SET NULL`
      // anonymises the linkage (ADR-042 R3, and the trigger that refuses a DELETE).
      await tx.query(`DELETE FROM learners WHERE id = $1`, [learner.id]);
    });
  }
}
