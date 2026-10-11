/**
 * P1.10 — Placement result persistence.
 *
 * Writes one `diagnostic_results` row and its N `diagnostic_responses` rows from the
 * `DiagnosticRun` returned by `administerDiagnostic` (P1.9 / ADR-024). The persistence contract
 * is the ADR-019 DDL in `src/migrations/1791331200000-create-schema.ts`; this file maps the
 * run shape onto it, table-for-table, and adds nothing the DDL does not have.
 *
 * Two mapping facts are load-bearing and are easy to get wrong:
 *
 * 1. **`bkt_priors_override` vs `bktPriorsOverride`.** The run spells it with a lowercase `kt`
 *    in code (`bktPriorsOverride`, ADR-024 D9); the column is `bkt_priors_override`. They are
 *    the same object — `{}` today, with the reason recorded in the ADR — and the mapping is the
 *    whole bridge.
 * 2. **`skill_theta` is the §3.3a lattice, not a `Record<string, number>`.** The column is
 *    `JSONB` and the `trg_diagnostic_skill_theta_state` trigger (G-8) rejects any entry whose
 *    `state` is not one of `point_estimate` / `band` / `insufficient_evidence`. So the
 *    serialization must preserve `state` **and** the per-state discriminator fields
 *    (`theta`/`se`/`cefr` for a point estimate, `cefrBand` for a band, `reason` for a gap).
 *    Flattening the lattice to a bare θ map would silently violate G-8.
 *
 * The write is one transaction: the result row is the FK target of every response row
 * (`diagnostic_responses.diagnostic_id → diagnostic_results.id`), so a half-written run would
 * either orphan responses or, worse, record a placement with no evidence behind it.
 *
 * `skill_id` on `diagnostic_responses` references `skills(id)` and `item_id` references
 * `items(id)` — the DDL is the contract and those FKs are real. ADR-024 Decision 9 records that
 * the response rows therefore cannot be written until ADR-021/P1.12 populate the `skills` /
 * `items` catalogues; that is an environment precondition, not a reason to drop the FKs.
 */

import { Injectable } from '@nestjs/common';
import { DataSource, type QueryRunner } from 'typeorm';
import type { DiagnosticRun, DomainTheta } from '../../domain/entities/pilot-bank.js';

/** §5.1 caps placement remediation at three micro-lessons; the DDL CHECK asserts the same. */
export const MAX_REMEDIATION_NODES = 3;

export interface PersistResult {
  readonly diagnosticId: string;
  readonly responseCount: number;
}

/** The run cannot be stored as given (a precondition the DDL would reject anyway). */
export class DiagnosticPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DiagnosticPersistenceError';
  }
}

@Injectable()
export class DiagnosticResultRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Persist `run` as one `diagnostic_results` row plus one `diagnostic_responses` row per
   * answer, inside a single transaction.
   *
   * `tx` lets a caller that already owns a transaction join it; when omitted the repository
   * opens (and closes) its own. The mode is carried in `ownsTransaction` rather than inferred
   * from `tx` at each call site, so a caller-supplied runner is never committed or released
   * here.
   */
  async persist(run: DiagnosticRun, tx?: QueryRunner): Promise<PersistResult> {
    if (run.remediationNodes.length > MAX_REMEDIATION_NODES) {
      throw new DiagnosticPersistenceError(
        `run.remediationNodes has ${run.remediationNodes.length} entries; the DDL CHECK and ` +
          `§5.1 both cap this at ${MAX_REMEDIATION_NODES}`,
      );
    }

    const ownsTransaction = tx === undefined;
    const qr: QueryRunner = tx ?? this.dataSource.createQueryRunner();

    if (ownsTransaction) {
      await qr.connect();
      await qr.startTransaction();
    }

    try {
      const resultRows = await qr.query(
        `INSERT INTO diagnostic_results (
           learner_id, form_version, created_at, theta, se_statistical, se_parameter,
           se_effective, precision_label, ci95_lower, ci95_upper, cefr, start_cefr,
           below_scale, start_node, remediation_nodes, profile, stopping_rule,
           bkt_priors_override, skill_theta
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
           $18::jsonb, $19::jsonb
         )
         RETURNING id`,
        [
          run.learnerId,
          run.formVersion,
          // ADR-024 D4: the run's own `completedAt`, not a fresh clock read — the persisted
          // record is then a function of the run and not of when the write happened to run.
          run.completedAt,
          run.thetaOverall,
          run.seStatistical,
          run.seParameter,
          run.seEffective,
          run.precisionLabel,
          run.ci95Lower,
          run.ci95Upper,
          run.cefr,
          run.startCefr,
          run.belowScale,
          run.startNode,
          run.remediationNodes,
          run.profile,
          run.stoppingRule,
          JSON.stringify(run.bktPriorsOverride ?? {}),
          JSON.stringify(serializeDomainThetas(run.domainThetas)),
        ],
      );

      const diagnosticId: string = resultRows[0].id;

      for (const response of run.responses) {
        await qr.query(
          `INSERT INTO diagnostic_responses (
             diagnostic_id, learner_id, item_id, skill_id, correct, response_time_ms,
             theta_after, se_after
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            diagnosticId,
            run.learnerId,
            response.itemId,
            response.skillId,
            response.correct,
            response.responseTimeMs,
            response.thetaAfter,
            response.seAfter,
          ],
        );
      }

      if (ownsTransaction) {
        await qr.commitTransaction();
      }

      return { diagnosticId, responseCount: run.responses.length };
    } catch (error) {
      if (ownsTransaction) {
        await qr.rollbackTransaction();
      }
      throw error;
    } finally {
      if (ownsTransaction) {
        await qr.release();
      }
    }
  }
}

/**
 * §3.3a's lattice → the `skill_theta` JSONB, keyed by **domain**, with `state` and its
 * per-state discriminator intact.
 *
 * Two shape constraints are not negotiable:
 *
 * 1. **It must be a JSON object, not an array.** The `trg_diagnostic_skill_theta_state` trigger
 *    (G-8) validates it with `jsonb_each(NEW.skill_theta)`, which only accepts an object; an
 *    array raises `cannot call jsonb_each on a non-object`. The keys are the domains — the ERD's
 *    §3.3a shape (`{"grammar": {...}, "listening": {...}}`), and the same key set as the run's
 *    `skillThetaReportable` map.
 * 2. **Every entry keeps `state`.** G-8 rejects any entry whose `state` is not one of the three,
 *    so the union is preserved rather than narrowed to the fields a point estimate happens to
 *    carry. A band and a gap are different reports, not missing numbers — reading a `band` entry
 *    as θ would reintroduce the "point estimate from a 3-item domain" defect ADR-024 D7 removed.
 *
 * Field names follow the `DomainTheta` the run carries (ADR-024 D7: `itemsAdministered`,
 * `cefrBand`); the ERD's illustrative JSONB uses the same structure with snake_case labels.
 */
export function serializeDomainThetas(
  domainThetas: readonly DomainTheta[],
): Record<string, unknown> {
  const byDomain: Record<string, unknown> = {};
  for (const entry of domainThetas) {
    byDomain[entry.domain] = {
      state: entry.state,
      itemsAdministered: entry.itemsAdministered,
      ...(entry.theta !== undefined && { theta: entry.theta }),
      ...(entry.se !== undefined && { se: entry.se }),
      ...(entry.cefr !== undefined && { cefr: entry.cefr }),
      ...(entry.cefrBand !== undefined && { cefrBand: entry.cefrBand }),
      ...(entry.reason !== undefined && { reason: entry.reason }),
    };
  }
  return byDomain;
}
