/**
 * Diagnostic Fixed-Form Executor — Stage-1 (no CAT)
 *
 * Administers the fixed form diagnostic (diagnostic_form_v1) in blueprint order.
 * Per ADR-017: Fixed-blueprint diagnostic executor (never selects by θ).
 *
 * The form is versioned as diagnostic_form_v1 and pinned on the run.
 */

import type { DiagnosticForm, DiagnosticResponse, SkillTheta, DiagnosticRun } from '../entities/pilot-bank.js';
import { createDiagnosticFormV1, validatePilotBank } from './pilot-bank.service.js';
import { computeThetaEstimate, computeStartNode } from './diagnostic-placement.service.js';
import { SKILL_TO_DOMAIN } from '../entities/pilot-bank.js';

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

  // Compute placement
  const placement = computeStartNode({
    thetaOverall,
    seEffective: form.calibrationDisclosure.seEffective,
    learnerProfile: profile,
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

function getCefrFromTheta(theta: number): string {
  if (theta < -0.5) return 'A1';
  if (theta < 0.5) return 'A2';
  if (theta < 1.5) return 'B1';
  if (theta < 2.5) return 'B2';
  return 'C1';
}
