import 'server-only';

import { cookies } from 'next/headers';

import { SESSION_LEARNER_COOKIE, SESSION_TOKEN_COOKIE } from '@/shared/auth-cookies';
import { apiFetch } from '@/infrastructure/auth/bff-session.server';

/**
 * The two LGPD rights, as the BFF serves them.
 *
 * **The learner id and the credential are resolved here, and never from the request.**
 * A browser that could name the learner would be a browser that could ask for somebody
 * else's export — or delete somebody else's account. The BFF reads the session cookies,
 * and the API's policy (`learner_isolation`, plus the `learner:export` and `learner:erase`
 * scopes) decides whether the request is allowed.
 *
 * **The export is streamed back as a download.** The learner asked for a copy of their
 * data; the useful answer is a file, not a JSON rendered into a `<pre>`. The
 * `Content-Disposition` is what turns it into a file, and the filename carries the
 * export's date so two downloads do not overwrite each other.
 *
 * **The erasure is a `DELETE` on the API, and the session dies with it.** After a
 * successful deletion the cookies are cleared: the credential belonged to an account
 * that no longer exists, and keeping it would leave the learner in a session that can
 * only fail.
 */

/** The learner's own id, from the session cookie. `null` when there is no session. */
export async function sessionLearnerId(): Promise<string | null> {
  const fromSession = (await cookies()).get(SESSION_LEARNER_COOKIE)?.value?.trim();
  if (fromSession !== undefined && fromSession.length > 0) return fromSession;
  return null;
}

/** The credential the session carries. `null` when there is no session. */
export async function sessionAccessToken(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_TOKEN_COOKIE)?.value?.trim();
  if (token !== undefined && token.length > 0) return token;
  return null;
}

/**
 * The learner's data, as the API published it.
 *
 * The API's answer is passed through **verbatim**: the BFF does not re-shape the export,
 * because a copy of somebody's data that the platform has edited is not a copy of their
 * data. The only thing added is the header that turns it into a file.
 */
export async function fetchAccountExport(): Promise<Response | null> {
  const learnerId = await sessionLearnerId();
  const token = await sessionAccessToken();
  if (learnerId === null || token === null) return null;

  return apiFetch(`/learners/${encodeURIComponent(learnerId)}/data-export`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * The learner's account, erased.
 *
 * `null` when there is no session, and the API's own status when it refuses — the
 * caller decides what to show, and a refusal is not a transport failure.
 */
export async function deleteAccount(): Promise<Response | null> {
  const learnerId = await sessionLearnerId();
  const token = await sessionAccessToken();
  if (learnerId === null || token === null) return null;

  return apiFetch(`/learners/${encodeURIComponent(learnerId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
