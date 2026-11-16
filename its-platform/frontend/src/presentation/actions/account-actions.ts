'use server';

import { revalidatePath } from 'next/cache';

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
 *
 * **The revalidation is the server's half of the contract; the client's half is the
 * context.** `revalidatePath('/', 'layout')` invalidates the root layout and every page
 * beneath it, so the *server* stops serving a rendering that carries the old name — the
 * name and the picture are drawn on every route, and a narrower revalidation would fix
 * the screen that saved and leave the rest of the platform lying.
 *
 * What it does **not** do is update the header the learner is looking at, and this was
 * measured rather than assumed: the layout is re-rendered on the server with the new
 * name (the server log proves it) and the client does not apply it, because a shared
 * layout is reused from the client cache and is not swapped when a Server Action mutates
 * the data behind it. `refresh()` and `router.refresh()` have the same ceiling. The
 * client's half is therefore the identity context (`AccountIdentityProvider`): whoever
 * saves publishes the new identity, and the header draws it at once.
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

    revalidatePath('/', 'layout');

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: serializeDomainError(toDomainError(error)) };
  }
}
