import type { DiagnosticRequestInput, PlacementRepository, PlacementResult } from '@/core';
import type { ApiTransport } from '../api-transport';
import type { components } from '../generated/api-types';
import { toPlacementResult, type PlacementResultDto } from '../mappers';

type DiagnosticRequestDto = components['schemas']['DiagnosticRequest'];

export class HttpPlacementRepository implements PlacementRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async run(learnerId: string, input: DiagnosticRequestInput): Promise<PlacementResult> {
    const body: DiagnosticRequestDto = {
      learner_id: learnerId,
      mode: input.mode,
      ...(input.priorEstimate === undefined
        ? {}
        : {
            prior_estimate: {
              theta: input.priorEstimate.theta,
              se: input.priorEstimate.se,
              source: input.priorEstimate.source,
            },
          }),
    };

    const dto = await this._transport.request<PlacementResultDto>({
      operation: 'learner.placement',
      pathParams: { learner_id: learnerId },
      body,
    });

    return toPlacementResult(dto);
  }
}
