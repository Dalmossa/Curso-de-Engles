import 'server-only';

import { cookies } from 'next/headers';
import { DomainError, type AccessTokenProvider, type LearnerIdentity } from '@/core';
import { SESSION_LEARNER_COOKIE, SESSION_TOKEN_COOKIE } from '@/shared/auth-cookies';
import { getServerEnv } from '../env/server-env';

/**
 * Who the current learner is, and which credential speaks for them.
 *
 * The BFF writes the session cookies after a successful login, and those are the identity every
 * page uses. `ITS_LEARNER_ID` / `ITS_API_TOKEN` remain support for the server-to-server deployment
 * (workers, scripts, the mocked deployment the project started with) — never a second identity
 * while a session cookie exists, because the token and the addressed learner would then disagree
 * and the API answers `404` by policy.
 *
 * With neither a cookie nor the environment fallback there is no identity at all. That is an
 * authentication failure, not a configuration crash: callers catch it and send the learner to
 * `/login` instead of rendering a 500.
 */
function unauthorized(detail: string): DomainError {
  return new DomainError({
    kind: 'unauthorized',
    status: 401,
    title: 'Not authenticated',
    detail,
    problemType: null,
    requestId: null,
    retryAfterSeconds: null,
  });
}

export function createEnvLearnerIdentity(): LearnerIdentity {
  return {
    async getLearnerId() {
      const fromSession = (await cookies()).get(SESSION_LEARNER_COOKIE)?.value?.trim();
      if (fromSession !== undefined && fromSession.length > 0) return fromSession;

      const fromEnv = getServerEnv().ITS_LEARNER_ID;
      if (fromEnv !== null) return fromEnv;

      throw unauthorized('There is no session and no configured learner identity.');
    },
  };
}

/**
 * The credential presented to the platform.
 *
 * A login writes the API's RS256 access token to an httpOnly cookie and it is presented as-is.
 * `ITS_API_TOKEN` is the optional server-to-server fallback. When neither exists we raise
 * `unauthorized` so the page redirects instead of firing a request the API would refuse.
 */
export function createEnvAccessTokenProvider(): AccessTokenProvider {
  return {
    async getAccessToken() {
      const fromSession = (await cookies()).get(SESSION_TOKEN_COOKIE)?.value?.trim();
      if (fromSession !== undefined && fromSession.length > 0) return fromSession;

      const fromEnv = getServerEnv().ITS_API_TOKEN;
      if (fromEnv !== null) return fromEnv;

      throw unauthorized('There is no session and no configured API token.');
    },
  };
}
