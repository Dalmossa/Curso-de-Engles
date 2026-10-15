import { Injectable } from '@nestjs/common';
import type { DiagnosticRequestDto } from './dto/diagnostic-request.dto.js';

@Injectable()
export class PlacementService {
  /**
   * The learner is the one **in the path** — the same authority the response echoes — and this stub
   * reads no member of `body`. The body's `learner_id` is required by the contract and validated by
   * `DiagnosticRequestDto`; whether the two identifiers must agree is an open decision, recorded in
   * `reports/api/fase-5.md` §8, so no rule about it is invented here.
   */
  async runDiagnostic(id: string, body: DiagnosticRequestDto) {
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
