/**
 * The browser-facing session cookies.
 *
 * They belong to the BFF, not to the API: the NestJS API sets `refresh_token` on its own origin
 * and scoped to its own refresh path, which the browser never sees. These three names are the
 * contract between the route handlers that write them, the proxy that gates navigation on them,
 * and the server container that presents the access token to the API. Spelling one of them twice
 * is how a login loop is born — the writer sets a name the reader does not check.
 */

/** The API's opaque session id (`SessionPayload.sessionId`). */
export const SESSION_ID_COOKIE = 'its_session_id';

/** The RS256 access token (`SessionPayload.accessToken`), sent as `Authorization: Bearer …`. */
export const SESSION_TOKEN_COOKIE = 'its_session';

/** The learner the session acts for (`user.learnerId`), used by the learner routes. */
export const SESSION_LEARNER_COOKIE = 'its_learner';

/**
 * Session cookies outlive the 15-minute access token on purpose: the proxy uses them only as an
 * *optimistic* gate, and dropping the browser back to `/login` while the server component is the
 * thing that must decide would replace one bug with another. When the token expires the API
 * answers `401` and the UI renders its "sua sessão não está ativa" state.
 */
export const SESSION_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
