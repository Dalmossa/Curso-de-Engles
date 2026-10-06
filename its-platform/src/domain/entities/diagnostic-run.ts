/**
 * Domain entities — diagnostic run (context 6).
 * Pure TypeScript, no framework imports (ADR-014).
 * ADR-017 §3: start_cefr = LOWEST band whose threshold sits inside band_bounds.
 */

export type PrecisionLabel = 'low' | 'medium' | 'high';

export class DiagnosticResult {
  constructor(
    public readonly id: string,
    public readonly learnerId: string,
    public readonly formVersion: string,
    public readonly createdAt: Date,
    public readonly theta: number,
    public readonly seStatistical: number,
    public readonly seParameter: number,
    public readonly seEffective: number,
    public readonly precisionLabel: PrecisionLabel,
    public readonly ci95Lower: number,
    public readonly ci95Upper: number,
    public readonly cefr: string,
    public readonly startCefr: string,
    public readonly belowScale: boolean,
    public readonly startNode: string,
    public readonly remediationNodes: string[],
    public readonly profile: string | null,
    public readonly stoppingRule: string,
    public readonly bktPriorsOverride: unknown,
    public readonly skillTheta: unknown,
  ) {}
}

export class DiagnosticResponse {
  constructor(
    public readonly id: string,
    public readonly diagnosticId: string,
    public readonly learnerId: string,
    public readonly itemId: string,
    public readonly skillId: string,
    public readonly correct: boolean,
    public readonly responseTimeMs: number,
    public readonly thetaAfter: number,
    public readonly seAfter: number,
  ) {}
}

/** Aggregate root: one run = one result + its item-level responses (domain-model §3.6). */
export class DiagnosticRun {
  constructor(
    public readonly result: DiagnosticResult,
    public readonly responses: DiagnosticResponse[],
  ) {}
}