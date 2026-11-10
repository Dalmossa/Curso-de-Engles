import type { DiagnosticRequestInput, PlacementRepository, PlacementResult } from '@/core';

/**
 * Starts a placement run and returns its verdict.
 *
 * The contract publishes no endpoint that *returns* diagnostic items — only
 * `POST /learners/{id}/placement`, which answers with a `start_node` and a θ estimate.
 * There is therefore no question flow to build in this slice, and inventing one would
 * mean inventing both the items and the endpoint. Recorded as a request for
 * `api-developer` (see the README's pendencies).
 */
export class RunDiagnostic {
  constructor(private readonly placement: PlacementRepository) {}

  async execute(learnerId: string, input: DiagnosticRequestInput): Promise<PlacementResult> {
    return this.placement.run(learnerId, input);
  }
}
