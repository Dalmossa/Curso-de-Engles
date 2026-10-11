/**
 * Diagnostic Fixed-Form Executor — Stage-1 (no CAT)
 *
 * Administers the fixed form diagnostic (diagnostic_form_v1) in blueprint order.
 * Per ADR-017: Fixed-blueprint diagnostic executor (never selects by θ).
 *
 * The form is versioned as diagnostic_form_v1 and pinned on the run.
 */

import type { DiagnosticForm, DiagnosticResponse, SkillTheta, DiagnosticRun } from '../entities/pilot-bank.js';
import { CEFR_THRESHOLDS, SKILL_TO_DOMAIN } from '../entities/pilot-bank.js';
import { createDiagnosticFormV1, validatePilotBank } from './pilot-bank.service.js';
import { computeThetaEstimate, computeStartNode } from './diagnostic-placement.service.js';

export interface AdministerDiagnosticInput {
  learnerId: string;
  sessionId: string;
  profile?: 'general' | 'it' | 'dev';
  responses: Array<{
    itemId: string;
    correct: boolean;
    responseTimeMs: number;
  }>;
}

export function administerDiagnostic(input: AdministerDiagnosticInput): DiagnosticRun {
  const { learnerId, sessionId, profile = 'general', responses } = input;

  // Create/pin the fixed form
  const form = createDiagnosticFormV1();

  // Validate the pilot bank (5 criteria)
  const validation = validatePilotBank(form);

  // Build response map
  const responseMap = new Map<string, { correct: boolean; responseTimeMs: number }>();
  for (const r of responses) {
    responseMap.set(r.itemId, r);
  }

  // Process responses in form order
  const diagnosticResponses: DiagnosticResponse[] = [];
  const thetaEstimatesPerStep: number[] = [0.0]; // start at 0.0 (A2 band center)

  for (let i = 0; i < form.items.length; i++) {
    const item = form.items[i]!;
    const resp = responseMap.get(item.id);
    if (!resp) {
      // If no response provided, skip (in practice would be required)
      continue;
    }

    // Update theta estimate with this response
    const previousTheta = thetaEstimatesPerStep[thetaEstimatesPerStep.length - 1];
    const { theta: newTheta, se: newSe } = computeThetaEstimate(
      [
        ...diagnosticResponses.map((dr) => {
          const itemForResp = form.items.find((it) => it.id === dr.itemId);
          return {
            correct: dr.correct,
            a: itemForResp?.a || 1.2,
            b: itemForResp?.b || 0,
          };
        }),
        { correct: resp.correct, a: item.a, b: item.b },
      ],
      previousTheta
    );

    thetaEstimatesPerStep.push(newTheta);

    diagnosticResponses.push({
      itemId: item.id,
      skillId: item.skillIds[0] || 'unknown',
      correct: resp.correct,
      responseTimeMs: resp.responseTimeMs,
      thetaAfter: newTheta,
      seAfter: newSe,
    });
  }

  // Compute final theta
  const finalResponses = diagnosticResponses.map((dr) => {
    const itemForResp = form.items.find((it) => it.id === dr.itemId);
    return {
      correct: dr.correct,
      a: itemForResp?.a || 1.2,
      b: itemForResp?.b || 0,
    };
  });

  const { theta: thetaOverall, se: seOverall } = computeThetaEstimate(finalResponses, 0.0);

  // Compute skill-level thetas (per skillId)
  const skillThetaMap = new Map<string, SkillTheta>();
  for (const item of form.items) {
    const skillId = item.skillIds[0]!;
    if (!skillId) continue;

    const skillResponses = diagnosticResponses
      .filter((dr) => dr.skillId === skillId)
      .map((dr) => {
        const itemForResp = form.items.find((it) => it.id === dr.itemId);
        return {
          correct: dr.correct,
          a: itemForResp?.a ?? 1.2,
          b: itemForResp?.b ?? 0,
        };
      });

    if (skillResponses.length === 0) continue;

    const { theta: skillTheta, se: skillSe } = computeThetaEstimate(skillResponses, 0.0);
    const skillCefr = getCefrFromTheta(skillTheta);

    skillThetaMap.set(skillId, {
      skillId,
      theta: skillTheta,
      se: skillSe,
      cefr: skillCefr,
      reportable: skillResponses.length >= 2, // reportable if >= 2 items administered
      itemsAdministered: skillResponses.length,
    });
  }

  // Compute domain-level aggregation (Grammar, Vocab, Reading, Pronunciation)
  const skillThetas: SkillTheta[] = Array.from(skillThetaMap.values());

  // Domain-level θs: each response aggregated under its item's domain via SKILL_TO_DOMAIN.
  // ADR-023 Decision 3's track rule compares vocabulary θ against grammar θ, and a skill-level
  // θ (one item's worth) is not the quantity §5.1 describes.
  const domainResponses = new Map<string, Array<{ correct: boolean; a: number; b: number }>>();
  for (const response of diagnosticResponses) {
    const domain = SKILL_TO_DOMAIN[response.skillId];
    if (!domain) continue;
    const item = form.items.find((it) => it.id === response.itemId);
    const aggregated = domainResponses.get(domain) ?? [];
    aggregated.push({ correct: response.correct, a: item?.a ?? 1.2, b: item?.b ?? 0 });
    domainResponses.set(domain, aggregated);
  }

  const domainThetas: Record<string, number> = {};
  for (const [domain, responses] of domainResponses) {
    domainThetas[domain] = computeThetaEstimate(responses, 0.0).theta;
  }

  // Compute placement
  const placement = computeStartNode({
    thetaOverall,
    seEffective: form.calibrationDisclosure.seEffective,
    learnerProfile: profile,
    grammarTheta: domainThetas['grammar'] ?? 0,
    vocabularyTheta: domainThetas['vocabulary'] ?? 0,
    readingTheta: domainThetas['reading'] ?? 0,
    pronunciationTheta: domainThetas['pronunciation'] ?? 0,
  });

  const startedAt = new Date();
  const completedAt = new Date(startedAt.getTime() + diagnosticResponses.length * 30000); // estimate 30s per item

  const calibrationDisclosure = form.calibrationDisclosure;

  return {
    formVersion: form.formVersion,
    formId: form.formId,
    learnerId,
    sessionId,
    startedAt,
    completedAt,
    responses: diagnosticResponses,
    thetaOverall,
    seStatistical: calibrationDisclosure.seStatistical,
    seParameter: calibrationDisclosure.seParameter,
    seEffective: calibrationDisclosure.seEffective,
    cefr: placement.startCefr,
    ci95Lower: thetaOverall - 1.96 * calibrationDisclosure.seEffective,
    ci95Upper: thetaOverall + 1.96 * calibrationDisclosure.seEffective,
    skillThetas,
    profile: placement.profile,
    recommendedStartNode: placement.startNode,
    calibrationDisclosure,
    skillThetaReportable: Object.fromEntries(
      Array.from(skillThetaMap.entries()).map(([k, v]) => [k, v.reportable])
    ),
    bktPriorsOverride: {}, // No BKT overrides from diagnostic yet
    placementProvisional: true, // Always true per ADR-017 (no calibrated item model exists yet)
    startCefr: placement.startCefr,
    startNode: placement.startNode,
    belowScale: placement.belowScale,
    remediationNodes: placement.remediationNodes,
  };
}

/**
 * CEFR band of a point estimate, `stats` §3.1's thresholds as data (`CEFR_THRESHOLDS`).
 *
 * Per ADR-023 Decision 1 this is the ladder `< −0.5 → A1`, `< 0.5 → A2`, `< 1.5 → B1`, else
 * `B2` — and never `C1`: `C1`/`C2` are not bands of this bank (`CEFR_THRESHOLDS` has no entry
 * for them), and the `2.5`/`C1` this function used to carry exists in no artefact.
 */
function getCefrFromTheta(theta: number): string {
  if (theta < CEFR_THRESHOLDS.A2.min) return CEFR_THRESHOLDS.A1.label;
  if (theta < CEFR_THRESHOLDS.B1.min) return CEFR_THRESHOLDS.A2.label;
  if (theta < CEFR_THRESHOLDS.B2.min) return CEFR_THRESHOLDS.B1.label;
  return CEFR_THRESHOLDS.B2.label;
}
