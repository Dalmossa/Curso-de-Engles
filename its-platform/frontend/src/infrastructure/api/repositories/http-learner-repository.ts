import type { LearnerProfile, LearnerRepository, SkillMastery } from '@/core';
import type { ApiTransport } from '../api-transport';
import { toLearnerProfile, toSkillMastery, type LearnerProfileDto, type MasteryDto } from '../mappers';

/**
 * One implementation, two transports.
 *
 * The same class serves a Server Component (through the direct gateway, with the token)
 * and a client-side refetch (through the BFF, without one). That is deliberate: if the
 * two paths had separate implementations, the browser's would be the one that drifts.
 */
export class HttpLearnerRepository implements LearnerRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async getProfile(learnerId: string): Promise<LearnerProfile> {
    const dto = await this._transport.request<LearnerProfileDto>({
      operation: 'learner.profile',
      pathParams: { learner_id: learnerId },
    });
    return toLearnerProfile(dto);
  }

  async getMastery(learnerId: string): Promise<readonly SkillMastery[]> {
    const dto = await this._transport.request<MasteryDto>({
      operation: 'learner.mastery',
      pathParams: { learner_id: learnerId },
    });
    return toSkillMastery(dto);
  }
}
