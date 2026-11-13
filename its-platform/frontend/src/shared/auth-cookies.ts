/**
 * The browser-facing session cookies.
 *
 * They belong to the BFF, not to the API: the NestJS API sets `refresh_token` on its own origin
 * and scoped to its own refresh path, which the browser never sees. These four names are the
 * contract between the route handlers that write them, the proxy that gates navigation on them
 * and refreshes them, and the server container that presents the access token to the API.
 * Spelling one of them twice is how a login loop is born — the writer sets a name the reader
 * does not check.
 */

/** The API's opaque session id (`SessionPayload.sessionId`). */
export const SESSION_ID_COOKIE = 'its_session_id';

/** The RS256 access token (`SessionPayload.accessToken`), sent as `Authorization: Bearer …`. */
export const SESSION_TOKEN_COOKIE = 'its_session';

/** The learner the session acts for (`user.learnerId`), used by the learner routes. */
export const SESSION_LEARNER_COOKIE = 'its_learner';

/**
 * The API's rotating refresh token (`SessionPayload.token`). It never reaches the browser as a
 * usable credential — it is httpOnly and only the proxy and the BFF read it, to exchange it for a
 * fresh access token before the 15-minute one expires.
 */
export const SESSION_REFRESH_COOKIE = 'its_refresh';

/**
 * Session cookies outlive the 15-minute access token on purpose: the refresh token is what keeps
 * the session alive, and the proxy renews the access token when it expires. Dropping the browser
 * back to `/login` merely because the short-lived credential aged out would replace one bug with
 * another.
 */
export const SESSION_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
