'use server';

import { toDomainError, type AccountIdentity } from '@/core';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { serializeDomainError, type ActionResult } from '@/shared/action-result';

/**
 * The account's Server Actions.
 *
 * **The learner id is resolved here, never sent by the browser.** A Server Action is an
 * untrusted entry point (Next.js's own words): anything can post to it. The action asks
 * the server for *its own* learner — the one the session cookie names — and that is the
 * only learner it will ever touch. A body carrying a `learner_id` would be a second
 * answer to "whose account?", and the platform has exactly one.
 *
 * **Failures are returned, never thrown.** A Server Action that throws reaches the browser
 * as a redacted error carrying only a digest — in production the message, the `kind` and
 * the correlation id are all gone, which is precisely the information the error state is
 * built to show. So the failure travels as data and is rebuilt into a `DomainError` on the
 * client, where `ErrorState` already knows what to do with it.
 */

/**
 * Saves the learner's display name and avatar.
 *
 * Both members travel explicitly, because the API's `PATCH` has **three** states per
 * member and "not sent" is one of them: `displayName: null` clears the name, and an
 * absent `displayName` leaves it as it is. The action therefore takes two arguments
 * rather than an optional patch — the caller always says what it means.
 */
export async function updateAccountProfileAction(input: {
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
}): Promise<ActionResult<AccountIdentity>> {
  try {
    const { useCases, learnerId } = await getServerContext();

    const data = await useCases.updateAccountProfile.execute(learnerId, {
      displayName: input.displayName,
      avatarUrl: input.avatarUrl,
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: serializeDomainError(toDomainError(error)) };
  }
}
