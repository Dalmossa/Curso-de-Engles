/**
 * Diagnostic Fixed-Form Executor — `diagnostic_form_v1` (Stage 1, no CAT).
 *
 * Administers ADR-017 §2's fixed form: **12 items — Grammar 4 · Vocabulary 3 · Reading 3 ·
 * Pronunciation 2 · Listening 0** — in blueprint order, never selected by θ (ADR-024 D2).
 *
 * Every property this file states is an ADR-024 decision, and each one used to be violated:
 *
 * | ADR-024 | What the executor did before | What it does now |
 * |---|---|---|
 * | D1 | `validatePilotBank(form)`'s result discarded | throws `DiagnosticFormInvalidError` |
 * | D2 | (was already positional) | locked by a test that varies only `correct` |
 * | D3 | `if (!resp) continue` — a 0-response run returned θ=0 → A2 | `DiagnosticIncompleteError` |
 * | D4 | `new Date()` and `Date.now()` inside a domain function | timestamps are inputs |
 * | D5 | no `stoppingRule` | `fixed_form_12_items` |
 * | D6 | the run's own `se` discarded; one interval | `seOverall` + two named intervals |
 * | D7 | `skillThetas` per skill, `reportable: n >= 2` | §3.3a's three-state lattice per domain |
 * | D8 | `profile` was the input role | the §4.1 false-beginner diagnosis |
 * | D9 | `{}` | `{}` — with the reason |
 * | D10 | a literal `true` | derived from `calibrationStatus` |
 *
 * The honest consequence of D7 for this form (§3.3a's floor of 5 items per domain against
 * 4/3/3/2/0) is that **no domain** gets a point estimate: Grammar, Vocabulary and Reading are
 * bands, Pronunciation and Listening are `insufficient_evidence`, and `cefr`/`start_cefr` rest
 * on the overall θ estimated from all 12 items. That is the intended outcome, not a defect.
 */

import type {
  DiagnosticForm,
  DiagnosticResponse,
  DiagnosticRun,
  DomainId,
  DomainTheta,
  FalseBeginnerProfile,
  LearnerRole,
  PilotBankItem,
} from '../entities/pilot-bank.js';
import { CEFR_THRESHOLDS, DIAGNOSTIC_DOMAINS } from '../entities/pilot-bank.js';
import { createDiagnosticFormV1, validatePilotBank } from './pilot-bank.service.js';
import { computeStartNode, computeThetaEstimate } from './diagnostic-placement.service.js';

/** `t_h` of ADR-017 §3 and the `1.96` of §3.6's `ci_95`, both two-sided 95 % intervals. */
const CI_Z = 1.96;

/**
 * `diagnostic_results.stopping_rule` is NOT NULL and, for a fixed form, a **literal**
 * (ADR-024 D5). §3.5's stopping rules (`SE(θ) < 0.35`, all-domains-touched) are CAT rules and
 * are unsatisfiable here, so none of them is read: the form owns its length.
 */
export const STOPPING_RULE_FIXED_FORM = 'fixed_form_12_items';

/** §3.3a: ≥ 5 items in a domain is the point-estimate floor. */
const DOMAIN_POINT_ESTIMATE_FLOOR = 5;

/** §3.3a: 3–4 items in a domain give a band. */
const DOMAIN_BAND_FLOOR = 3;

/** ADR-017 §2's blueprint, including the domain it explicitly removed. */
const FIXED_FORM_COMPOSITION: Readonly<Record<DomainId, number>> = {
  grammar: 4,
  vocabulary: 3,
  reading: 3,
  pronunciation: 2,
  listening: 0,
};

/** The run's form failed its own gate. Carries the criteria that failed (ADR-024 D1). */
export class DiagnosticFormInvalidError extends Error {
  readonly failures: readonly string[];

  constructor(failures: readonly string[]) {
    super(`diagnostic_form_v1 refused: ${failures.join('; ')}`);
    this.name = 'DiagnosticFormInvalidError';
    this.failures = failures;
  }
}

/**
 * ADR-024 D3: a placement is never estimated from a subset.
 *
 * This is the removal of defect 1 — before it, a run with **zero** responses returned
 * `θ = 0` → `cefr A2` → `les_a2_greetings_intro`, a confident placement derived from nothing.
 */
export class DiagnosticIncompleteError extends Error {
  readonly missingItemIds: readonly string[];

  constructor(missingItemIds: readonly string[]) {
    super(
      `diagnostic_form_v1 incomplete: ${missingItemIds.length} item(s) without a response — ` +
        missingItemIds.join(', ')
    );
    this.name = 'DiagnosticIncompleteError';
    this.missingItemIds = missingItemIds;
  }
}

/** ADR-024 D3: a submission naming an item the form does not have, or naming one twice. */
export class DiagnosticResponseError extends Error {
  readonly unknownItemIds: readonly string[];
  readonly duplicateItemIds: readonly string[];

  constructor(unknownItemIds: readonly string[], duplicateItemIds: readonly string[]) {
    const parts: string[] = [];
    if (unknownItemIds.length > 0) parts.push(`unknown: ${unknownItemIds.join(', ')}`);
    if (duplicateItemIds.length > 0) parts.push(`duplicated: ${duplicateItemIds.join(', ')}`);
    super(`diagnostic_form_v1 response set is not one-to-one — ${parts.join('; ')}`);
    this.name = 'DiagnosticResponseError';
    this.unknownItemIds = unknownItemIds;
    this.duplicateItemIds = duplicateItemIds;
  }
}

/**
 * ADR-024 D4: the run is pure, so a reversed timestamp pair is a caller error and not
 * something the executor repairs by reading the clock.
 */
export class DiagnosticTimestampError extends Error {
  readonly startedAt: Date;
  readonly completedAt: Date;

  constructor(startedAt: Date, completedAt: Date) {
    super(
      `diagnostic_form_v1 timestamps are reversed: completedAt (${completedAt.toISOString()}) < ` +
        `startedAt (${startedAt.toISOString()})`
    );
    this.name = 'DiagnosticTimestampError';
    this.startedAt = startedAt;
    this.completedAt = completedAt;
  }
}

/** One submitted answer. The executor reads `correct` only to *score*, never to *select* (D2). */
export interface AdministerDiagnosticResponse {
  readonly itemId: string;
  readonly correct: boolean;
  readonly responseTimeMs: number;
}

export interface AdministerDiagnosticInput {
  readonly learnerId: string;
  readonly sessionId: string;
  /**
   * The track input (ADR-024 D8), which is what §5.1's IT rule reads. It is **not** the run's
   * `profile`: `diagnostic_results.profile` is the §4 false-beginner diagnosis, derived below.
   */
  readonly role?: LearnerRole;
  /** ADR-024 D4: supplied by the caller. The executor never calls `new Date()`. */
  readonly startedAt: Date;
  /** ADR-024 D4: supplied by the caller, and never before `startedAt`. */
  readonly completedAt: Date;
  /** Exactly one per form item (ADR-024 D3). */
  readonly responses: ReadonlyArray<AdministerDiagnosticResponse>;
}

/**
 * The two projections `administerDiagnostic` needs from a run's responses, both computed here
 * so the lattice is *derived* and not listed (ADR-024 D7 / acceptance test 9).
 */
export interface DomainReport {
  /** One entry per blueprint domain + Listening, always all 5, in `DIAGNOSTIC_DOMAINS` order. */
  readonly domainThetas: DomainTheta[];
  /** `skillThetaReportable[domain] = (state === 'point_estimate')`, derived from the entry. */
  readonly skillThetaReportable: Record<string, boolean>;
  /**
   * θ_d by domain — the **routing** inputs of `curriculum-graph` §5.1 / ADR-023 Decisions 3–4,
   * never the learner-facing numbers. §3.3a is a rule about what may be *reported*, and a
   * 3-item domain θ is computed (`computeThetaEstimate` over 3 responses) but not identified:
   * `domainThetas` carries only the band, and this map exists so routing need not re-derive it.
   */
  readonly thetaByDomain: Record<string, number>;
}

/**
 * Administer the fixed form.
 *
 * Total and side-effect free (ADR-024 D4): `startedAt`/`completedAt` come from the caller, the
 * form id is deterministic, the order is the form's own, and two calls with the same input
 * deep-compare equal. It fails closed (D1/D3) rather than returning a placement it cannot
 * support.
 */
export function administerDiagnostic(input: AdministerDiagnosticInput): DiagnosticRun {
  const { learnerId, sessionId, responses } = input;
  const role: LearnerRole = input.role ?? 'general';

  // D4 — purity first: neither this check nor anything below reads a clock.
  if (input.completedAt.getTime() < input.startedAt.getTime()) {
    throw new DiagnosticTimestampError(input.startedAt, input.completedAt);
  }

  const form = createDiagnosticFormV1();

  // D1 — the five P1.8 criteria gate the run. Before ADR-024 their result was computed and
  // discarded, so the exact 4/3/3/2 blueprint the acceptance names gated nothing.
  const validation = validatePilotBank(form);
  if (!validation.pass) {
    throw new DiagnosticFormInvalidError(
      validation.criteria.filter(c => !c.pass).map(c => `criterion ${c.criterion} (${c.name})`)
    );
  }
  // D1's independent half: the shape the executor assumes, asserted rather than assumed.
  assertFixedFormShape(form);

  const responseMap = requireCompleteResponses(form, input.responses);

  // D2: administered in the form's declared order. The loop below reads `correct` to *score* an
  // item that is already chosen; it must never read it (or `responseTimeMs`) to choose one.
  const diagnosticResponses: DiagnosticResponse[] = [];
  const scoringVectors: Array<{ correct: boolean; a: number; b: number }> = [];
  let previousTheta = 0.0;

  for (const item of form.items) {
    const response = responseMap.get(item.id)!;
    scoringVectors.push({ correct: response.correct, a: item.a, b: item.b });

    const { theta, se } = computeThetaEstimate(scoringVectors, previousTheta);
    previousTheta = theta;

    diagnosticResponses.push({
      itemId: item.id,
      skillId: item.skillIds[0] ?? 'unknown',
      correct: response.correct,
      responseTimeMs: response.responseTimeMs,
      thetaAfter: theta,
      seAfter: se,
    });
  }

  // The overall estimate is a point estimate even though no domain is (§3.3a is
  // per-domain): all 12 items are unidimensional evidence for it.
  const { theta: thetaOverall, se: seOverall } = computeThetaEstimate(scoringVectors, 0.0);

  const { domainThetas, skillThetaReportable, thetaByDomain } = computeDomainReport(
    form.items,
    input.responses
  );

  // §4.1, the two signals a 12-item run can actually evaluate (ADR-024 D8).
  const profile = deriveFalseBeginnerProfile(thetaByDomain);

  const { calibrationDisclosure } = form;
  const { seEffective } = calibrationDisclosure;

  const placement = computeStartNode({
    thetaOverall,
    seEffective,
    role,
    profile,
    grammarTheta: thetaByDomain['grammar'] ?? 0,
    vocabularyTheta: thetaByDomain['vocabulary'] ?? 0,
    readingTheta: thetaByDomain['reading'] ?? 0,
    pronunciationTheta: thetaByDomain['pronunciation'] ?? 0,
  });

  return {
    formVersion: form.formVersion,
    formId: form.formId,
    learnerId,
    sessionId,
    role,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    responses: diagnosticResponses,
    thetaOverall,
    // D6: the run's *realised* SE, which §3.6's `overall.se` is and which the previous
    // implementation computed and then discarded.
    seOverall,
    // D6: these four stay the *declared* disclosure values (ADR-017 §1). The two are different
    // numbers on purpose — §3.6's example (`se` 0.28, `se_statistical` 0.31, `se_effective`
    // 0.43) has one per purpose, and collapsing them would fabricate precision.
    seStatistical: calibrationDisclosure.seStatistical,
    seParameter: calibrationDisclosure.seParameter,
    seEffective,
    precisionLabel: calibrationDisclosure.precisionLabel,
    // ADR-023 Decision 1: the point estimate's band, distinct from `start_cefr` (the interval
    // rule). They disagree more often than not, and that is `startCefr !== cefr` being normal.
    cefr: getCefrFromTheta(thetaOverall),
    // D6: §3.6 `overall.ci_95` — `θ ± 1.96·se` with the **run's** `se`.
    ci95Lower: thetaOverall - CI_Z * seOverall,
    ci95Upper: thetaOverall + CI_Z * seOverall,
    // D6: the `band_bounds` interval of ADR-017 §3 / ADR-023 Decision 2, `θ ± 1.96·SE_eff`.
    // This is the one that *explains* `start_cefr`; `ci95*` above is a claim about the estimate.
    // Both are recoverable from persisted `theta`/`se_effective`, so no column is added.
    placementCi95Lower: thetaOverall - CI_Z * seEffective,
    placementCi95Upper: thetaOverall + CI_Z * seEffective,
    domainThetas,
    profile,
    recommendedStartNode: placement.startNode,
    calibrationDisclosure,
    skillThetaReportable,
    // D9: §4.2 ("inflate P(L₀) for grammar/vocab, deflate for speaking/pronunciation") states
    // *directions*, never magnitudes, and the map is a learner-model write. Filling it with
    // invented numbers is the choice ADR-024 rejects; it stays empty until ADR-021/P1.12
    // populates it from something that actually states values.
    bktPriorsOverride: {},
    // D10 (G-7): derived, so it flips by itself when Stage-2 calibration lands.
    placementProvisional: form.items.some(
      item => item.calibrationStatus !== 'empirically_calibrated'
    ),
    startCefr: placement.startCefr,
    startNode: placement.startNode,
    belowScale: placement.belowScale,
    remediationNodes: placement.remediationNodes,
    stoppingRule: STOPPING_RULE_FIXED_FORM,
  };
}

/**
 * The composition the executor assumes, asserted on the built `DiagnosticForm` (ADR-024 D1).
 *
 * Independent of `validatePilotBank` on purpose: that function's criterion 1 reads
 * `form.blueprint`, so a form whose `items` disagreed with its own `blueprint` would pass —
 * and the item list is what is actually administered.
 */
function assertFixedFormShape(form: DiagnosticForm): void {
  const failures: string[] = [];
  const itemIds = form.items.map(item => item.id);

  if (itemIds.length !== 12) failures.push(`12 items expected, found ${itemIds.length}`);

  const distinct = new Set(itemIds);
  if (distinct.size !== itemIds.length) {
    failures.push(`${itemIds.length} items but only ${distinct.size} distinct id(s)`);
  }

  for (const domain of DIAGNOSTIC_DOMAINS) {
    const expected = FIXED_FORM_COMPOSITION[domain];
    const actual = form.items.filter(item => item.domainId === domain).length;
    if (actual !== expected) {
      failures.push(`domain ${domain}: ${actual} item(s), expected ${expected}`);
    }
  }

  const domains: readonly string[] = DIAGNOSTIC_DOMAINS;
  const foreign = form.items.filter(item => !domains.includes(item.domainId)).map(i => i.id);
  if (foreign.length > 0) failures.push(`unknown domainId on: ${foreign.join(', ')}`);

  if (failures.length > 0) throw new DiagnosticFormInvalidError(failures);
}

/**
 * ADR-024 D3: **exactly one** response per form item, and no others.
 *
 * A duplicate is reported before a missing one because it is the malformation of the
 * submission itself; with neither, a missing answer makes the run incomplete. `θ` is never
 * estimated from the responses that happen to be present.
 */
function requireCompleteResponses(
  form: DiagnosticForm,
  responses: ReadonlyArray<AdministerDiagnosticResponse>
): Map<string, { correct: boolean; responseTimeMs: number }> {
  const known = new Set(form.items.map(item => item.id));
  const counts = new Map<string, number>();
  for (const response of responses) {
    counts.set(response.itemId, (counts.get(response.itemId) ?? 0) + 1);
  }

  const duplicateItemIds = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([itemId]) => itemId);
  const unknownItemIds = [...counts.keys()].filter(itemId => !known.has(itemId));
  if (unknownItemIds.length > 0 || duplicateItemIds.length > 0) {
    throw new DiagnosticResponseError(unknownItemIds, duplicateItemIds);
  }

  const missingItemIds = form.items.map(item => item.id).filter(itemId => !counts.has(itemId));
  if (missingItemIds.length > 0) throw new DiagnosticIncompleteError(missingItemIds);

  const byItemId = new Map<string, { correct: boolean; responseTimeMs: number }>();
  for (const response of responses) {
    byItemId.set(response.itemId, {
      correct: response.correct,
      responseTimeMs: response.responseTimeMs,
    });
  }
  return byItemId;
}

/**
 * §3.3a's lattice, computed from how many items of each domain were administered.
 *
 * Domain-keyed, not skill-keyed (§3.6 `skills` is keyed by domain), and always all five
 * entries even when a domain has zero: a gap that is not shown is a gap that gets read as a
 * zero. `skillThetaReportable` is derived from `state` here and nowhere else.
 */
export function computeDomainReport(
  items: ReadonlyArray<PilotBankItem>,
  responses: ReadonlyArray<{ itemId: string; correct: boolean }>
): DomainReport {
  const correctByItemId = new Map(responses.map(r => [r.itemId, r.correct]));

  const domainThetas: DomainTheta[] = [];
  const skillThetaReportable: Record<string, boolean> = {};
  const thetaByDomain: Record<string, number> = {};

  for (const domain of DIAGNOSTIC_DOMAINS) {
    const vectors: Array<{ correct: boolean; a: number; b: number }> = [];
    for (const item of items) {
      if (item.domainId !== domain) continue;
      const correct = correctByItemId.get(item.id);
      if (correct === undefined) continue;
      vectors.push({ correct, a: item.a, b: item.b });
    }

    const itemsAdministered = vectors.length;

    if (itemsAdministered === 0) {
      domainThetas.push({
        domain,
        itemsAdministered,
        state: 'insufficient_evidence',
        reason: insufficientEvidenceReason(domain, itemsAdministered),
      });
      skillThetaReportable[domain] = false;
      continue;
    }

    const { theta, se } = computeThetaEstimate(vectors, 0.0);
    // The routing inputs (§5.1) exist for every non-empty domain; only the *report* is
    // gated by §3.3a, which is why this map and `domainThetas` are not the same object.
    thetaByDomain[domain] = theta;

    if (itemsAdministered >= DOMAIN_POINT_ESTIMATE_FLOOR) {
      domainThetas.push({
        domain,
        itemsAdministered,
        state: 'point_estimate',
        theta,
        se,
        cefr: getCefrFromTheta(theta),
      });
      skillThetaReportable[domain] = true;
    } else if (itemsAdministered >= DOMAIN_BAND_FLOOR) {
      domainThetas.push({
        domain,
        itemsAdministered,
        state: 'band',
        cefrBand: formatCefrSpan(theta, se),
      });
      skillThetaReportable[domain] = false;
    } else {
      domainThetas.push({
        domain,
        itemsAdministered,
        state: 'insufficient_evidence',
        reason: insufficientEvidenceReason(domain, itemsAdministered),
      });
      skillThetaReportable[domain] = false;
    }
  }

  return { domainThetas, skillThetaReportable, thetaByDomain };
}

/**
 * §3.3a's "insufficient evidence", with the artefact that causes it.
 *
 * Listening's is §2.1 (`assessment-item-spec.md` §2.5, corrections X3 + X4): the domain was
 * removed from the blueprint, so no listening item has `a`/`b` parameters and none can count
 * towards the overall θ either. The other reasons are the run's own counts.
 */
function insufficientEvidenceReason(domain: DomainId, itemsAdministered: number): string {
  if (domain === 'listening') {
    return (
      'removed from the blueprint (§2.1): 0 items administered, and no listening item has ' +
      'a/b parameters to estimate a θ from'
    );
  }
  return (
    `${itemsAdministered} item(s) administered — below the 3-item floor, so the domain is ` +
    'excluded from the profile rather than reported from noise (§3.3a)'
  );
}

/**
 * §3.3a's band ("A1–A2"), derived from the same interval logic ADR-017 §3 routes with:
 * the span of CEFR bands covered by `θ_d ± 1.96·SE_d` at the domain level.
 *
 * The ladder is `CEFR_THRESHOLDS` (stats §3.1) and the span is monotone in θ_d by
 * construction, so a higher domain θ never yields a lower band. Three items genuinely do not
 * identify more than this, and §3.3a's own framing is that a wide band is better than a
 * fabricated narrow one.
 */
function formatCefrSpan(theta: number, se: number): string {
  const halfWidth = CI_Z * se;
  const lower = getCefrFromTheta(theta - halfWidth);
  const upper = getCefrFromTheta(theta + halfWidth);
  return lower === upper ? lower : `${lower}–${upper}`;
}

/**
 * The §4 false-beginner diagnosis, from §4.1's **two computable signals** (ADR-024 D8):
 *
 * - *Grammar θ ≫ Vocabulary θ, Δ > 1.0* — studied grammar, no exposure.
 * - *Pronunciation θ < −1.5 while Reading θ > 0.0* — §4.1's own MVP replacement for the
 *   Reading ≫ Listening signal, which Listening's removal from the blueprint (§2.1) made
 *   unusable ("must be inert until the corpus exists").
 *
 * §4.1's other two signals are **not** evaluated here because the request does not carry what
 * they need: *High guess rate* (`P(G) > 0.35`) requires a per-item `guessed` flag, and
 * *Self-report vs θ mismatch* requires the CEFR self-estimate from the profile questionnaire.
 * Inventing either would be the same move as inventing an SE.
 */
function deriveFalseBeginnerProfile(thetaByDomain: Readonly<Record<string, number>>): FalseBeginnerProfile {
  const grammarTheta = thetaByDomain['grammar'];
  const vocabularyTheta = thetaByDomain['vocabulary'];
  const pronunciationTheta = thetaByDomain['pronunciation'];
  const readingTheta = thetaByDomain['reading'];

  if (grammarTheta !== undefined && vocabularyTheta !== undefined && grammarTheta - vocabularyTheta > 1.0) {
    return 'false_beginner_suspected';
  }

  if (pronunciationTheta !== undefined && readingTheta !== undefined && pronunciationTheta < -1.5 && readingTheta > 0.0) {
    return 'false_beginner_suspected';
  }

  return null;
}

/**
 * CEFR band of a point estimate, `stats` §3.1's thresholds as data (`CEFR_THRESHOLDS`).
 *
 * Per ADR-023 Decision 1 this is `< −0.5 → A1`, `< 0.5 → A2`, `< 1.5 → B1`, else `B2` — and
 * never `C1`: `C1`/`C2` are not bands of this bank (`CEFR_THRESHOLDS` has no entry for them),
 * which makes `getCefrFromTheta` total over the whole real line.
 */
function getCefrFromTheta(theta: number): string {
  if (theta < CEFR_THRESHOLDS.A2.min) return CEFR_THRESHOLDS.A1.label;
  if (theta < CEFR_THRESHOLDS.B1.min) return CEFR_THRESHOLDS.A2.label;
  if (theta < CEFR_THRESHOLDS.B2.min) return CEFR_THRESHOLDS.B1.label;
  return CEFR_THRESHOLDS.B2.label;
}
