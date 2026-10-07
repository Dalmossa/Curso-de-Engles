import { Injectable } from '@nestjs/common';

@Injectable()
export class PlacementService {
  async runDiagnostic(id: string, body: any) {
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
