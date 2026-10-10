/**
 * Diagnostic Placement Service — Fixed-form diagnostic placement
 *
 * Maps overall θ estimate to CEFR level and start node per:
 * - stats-progress-evaluation-spec.md §3.1 (CEFR thresholds: A2 = -0.5, B1 = 0.5, B2 = 1.5)
 * - curriculum-graph-spec.md §5.1 (Start node mapping)
 *
 * Per ADR-017: Fixed-blueprint diagnostic executor (no CAT). Items are administered
 * in fixed order by blueprint position.
 */

import type { StartNodeMapping } from '../entities/pilot-bank.js';
import { CEFR_THRESHOLDS, START_NODE_TABLE, REMEDIATION_NODES } from '../entities/pilot-bank.js';

export interface PlacementInput {
  thetaOverall: number;
  seEffective: number;
  learnerProfile?: 'general' | 'it' | 'dev'; // tech context 30% in diagnostic
}

export function computeStartNode(input: PlacementInput): StartNodeMapping {
  const { thetaOverall, seEffective, learnerProfile = 'general' } = input;

  // Compute CI₉₅
  const ci95Lower = thetaOverall - 1.96 * seEffective;
  const ci95Upper = thetaOverall + 1.96 * seEffective;

  let cefr: string;
  let belowScale = false;

  // Determine CEFR level from θ per §3.1
  if (thetaOverall < -2.0) {
    cefr = 'A1';
    belowScale = true;
  } else if (thetaOverall < -0.5) {
    cefr = 'A1';
    belowScale = false;
  } else if (thetaOverall < 0.5) {
    cefr = 'A2';
    belowScale = false;
  } else if (thetaOverall < 1.5) {
    cefr = 'B1';
    belowScale = false;
  } else if (thetaOverall < 2.5) {
    cefr = 'B2';
    belowScale = false;
  } else {
    cefr = 'B2';
    belowScale = true;
  }

  // Map to start node
  const tableEntry = START_NODE_TABLE[cefr];
  if (!tableEntry) {
    // Fallback to A1
    const fallback = START_NODE_TABLE['A1'] as { general: string; it: string };
    return {
      startCefr: 'A1',
      startNode: learnerProfile === 'it' || learnerProfile === 'dev' ? fallback.it : fallback.general,
      belowScale,
      remediationNodes: belowScale ? [...REMEDIATION_NODES] : [],
      profile: learnerProfile,
    };
  }

  const startNode = learnerProfile === 'it' || learnerProfile === 'dev' ? tableEntry.it : tableEntry.general;

  return {
    startCefr: cefr,
    startNode,
    belowScale,
    remediationNodes: belowScale ? [...REMEDIATION_NODES] : [],
    profile: learnerProfile,
  };
}

/**
 * Simple 2PL IRT scoring for fixed form (no CAT)
 * logit = a*(θ - b)
 * P(correct) = 1 / (1 + exp(-a*(θ - b)))
 */
export function computeThetaEstimate(responses: Array<{ correct: boolean; a: number; b: number }>, initialTheta = 0.0): {
  theta: number;
  se: number;
} {
  // Simple maximum likelihood estimate (EAP-like approximation for fixed form)
  // For the pilot, use a simple Newton-Raphson with few iterations
  let theta = initialTheta;
  const maxIter = 20;
  const lr = 0.1;

  for (let iter = 0; iter < maxIter; iter++) {
    let sumInfo = 0;
    let sumScore = 0;

    for (const r of responses) {
      if (r.correct) {
        sumScore += r.a;
      }
      // Fisher information approximation for 2PL
      const p = 1 / (1 + Math.exp(-r.a * (theta - r.b)));
      sumInfo += r.a * r.a * p * (1 - p);
    }

    // Gradient approximation
    const gradient = sumScore - sumInfo * (theta - initialTheta);
    theta += lr * gradient;

    // Convergence check
    if (Math.abs(lr * gradient) < 1e-4) break;
  }

  // Compute SE from Fisher information
  let info = 0;
  for (const r of responses) {
    const p = 1 / (1 + Math.exp(-r.a * (theta - r.b)));
    info += r.a * r.a * p * (1 - p);
  }
  const se = info > 0 ? 1 / Math.sqrt(info) : 1.0;

  return { theta, se };
}
