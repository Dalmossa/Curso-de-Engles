import type { DiagnosticRequestInput, PlacementResult } from '../entities/placement';

/** `POST /learners/{learner_id}/placement`. */
export interface PlacementRepository {
  run(learnerId: string, input: DiagnosticRequestInput): Promise<PlacementResult>;
}
