/**
 * `POST /learners/{id}/placement`.
 *
 * The contract exposes no endpoint that *returns* diagnostic items, so this slice can
 * only start a placement run and show its verdict — there is no question flow to
 * build. Recorded as a request for `api-developer` rather than papered over with
 * invented items.
 */
export type DiagnosticMode = 'adaptive' | 'fixed';

export type PriorEstimateSource = 'previous_diagnostic' | 'self_report' | 'external_test';

export interface PriorEstimate {
  readonly theta: number;
  readonly se: number;
  readonly source: PriorEstimateSource;
}

export interface DiagnosticRequestInput {
  readonly mode: DiagnosticMode;
  readonly priorEstimate?: PriorEstimate;
}

/**
 * `PlacementResult`.
 *
 * `theta`/`standardError` are carried because the contract publishes them; ADR-043 R1
 * says raw θ and `se` are not to be exposed on public surfaces. The two statements
 * contradict each other and the resolution is a human decision, so this slice renders
 * the returned values and flags the conflict instead of silently picking a side.
 */
export interface PlacementResult {
  readonly learnerId: string;
  /** `^(les|mod)_[a-z0-9_]+$` — a lesson or module id. */
  readonly startNode: string;
  readonly theta: number;
  readonly standardError: number;
  readonly ci95: readonly [number, number];
  /** `null` = not yet assessed. */
  readonly confidence: string | null;
  readonly stoppingRule: string | null;
}
