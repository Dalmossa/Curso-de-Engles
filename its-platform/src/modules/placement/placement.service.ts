import { Injectable } from '@nestjs/common';

import { LearnerScopeService } from '../learners/learner-scope.service.js';
import type { DiagnosticRequestDto } from './dto/diagnostic-request.dto.js';

@Injectable()
export class PlacementService {
  constructor(private readonly learnerScope: LearnerScopeService) {}

  /**
   * The addressed learner must be visible to the caller before anything is computed: the load under
   * the caller's RLS context is what makes this route answer 404 for another learner's id (ADR-038
   * D3) instead of a placement result.
   *
   * The body's `learner_id` is still read by nobody. It is required by the contract and validated by
   * `DiagnosticRequestDto`; whether the two identifiers must agree is an open decision, recorded in
   * `reports/api/fase-5.md` §8, so no rule about it is invented here — and note that the load above
   * uses the **path** id under the **token's** subject, which is exactly what would make such a rule
   * unnecessary.
   */
  async runDiagnostic(subject: string, id: string, body: DiagnosticRequestDto) {
    await this.learnerScope.requireVisible(subject, id);

    return {
      learner_id: id,
      start_node: 'les_a2_airport',
      theta_estimate: {
        theta: 0.0,
        se: 0.5,
        ci95: [-0.98, 0.98],
      },
      blueprint_coverage: {},
      stopping_rule: 'fixed_form',
    };
  }
}
