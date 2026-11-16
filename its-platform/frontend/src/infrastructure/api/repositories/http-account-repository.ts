import type { AccountIdentity, AccountProfilePatch, AccountRepository } from '@/core';
import type { ApiTransport } from '../api-transport';
import {
  toAccountIdentity,
  type AccountIdentitySource,
  type UpdateLearnerProfileRequestDto,
} from '../mappers';

/**
 * The HTTP adapter for the account.
 *
 * **The identity is read from the profile, not from a separate endpoint.** The API
 * publishes one route that carries the identity — `GET /learners/{learner_id}/profile` —
 * and the `PATCH` answers with the same three members plus the band. Reading the profile
 * and mapping its identity members keeps the interface from inventing a second source for
 * the same fact: the name the header shows and the name the account screen shows are read
 * from the same place, by the same mapper.
 *
 * **The body carries the two members and nothing else.** The contract declares
 * `additionalProperties: false`, so a member the API does not know is rejected rather
 * than ignored — and this class therefore adds no key of its own. In particular it does
 * **not** add `learner_id`: the learner is named in the path, and the path's
 * `learner_id` is resolved server-side (`serverResolvedParams`), so the browser cannot
 * ask for somebody else's account even by accident.
 *
 * **The three states of a patch survive the trip.** A member absent from the body is not
 * sent; a member set to `null` is sent as `null`; a member with a value is sent as the
 * value. `JSON.stringify` drops `undefined`, which is exactly the "leave it as it is"
 * the API expects.
 */
export class HttpAccountRepository implements AccountRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async getIdentity(learnerId: string): Promise<AccountIdentity> {
    const dto = await this._transport.request<AccountIdentitySource>({
      operation: 'learner.profile',
      pathParams: { learner_id: learnerId },
    });
    return toAccountIdentity(dto);
  }

  async updateProfile(learnerId: string, patch: AccountProfilePatch): Promise<AccountIdentity> {
    const body: UpdateLearnerProfileRequestDto = {
      ...(patch.displayName === undefined ? {} : { display_name: patch.displayName }),
      ...(patch.avatarUrl === undefined ? {} : { avatar_url: patch.avatarUrl }),
    };

    const dto = await this._transport.request<AccountIdentitySource>({
      operation: 'learner.updateProfile',
      pathParams: { learner_id: learnerId },
      body,
    });

    return toAccountIdentity(dto);
  }
}
