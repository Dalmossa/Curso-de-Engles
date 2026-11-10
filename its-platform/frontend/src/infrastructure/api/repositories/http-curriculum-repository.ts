import type { NextActivity, CurriculumRepository, NextActivityContext } from '@/core';
import type { ApiTransport } from '../api-transport';
import { toNextActivity, type NextActivityDto } from '../mappers';

export class HttpCurriculumRepository implements CurriculumRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async getNextActivity(learnerId: string, context?: NextActivityContext): Promise<NextActivity> {
    const dto = await this._transport.request<NextActivityDto>({
      operation: 'learner.next',
      pathParams: { learner_id: learnerId },
      query: {
        time_budget_minutes: context?.timeBudgetMinutes,
        device: context?.device,
      },
    });
    return toNextActivity(dto);
  }
}
