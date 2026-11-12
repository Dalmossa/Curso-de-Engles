import 'server-only';

import { cookies } from 'next/headers';
import type { AccessTokenProvider, LearnerIdentity } from '@/core';
import { SESSION_LEARNER_COOKIE, SESSION_TOKEN_COOKIE } from '@/shared/auth-cookies';
import { getServerEnv } from '../env/server-env';

/**
 * Who the current learner is.
 *
 * The login flow puts the learner id in an httpOnly cookie, and that is the identity every page
 * uses. `ITS_LEARNER_ID` remains the fallback for the mocked/unauthenticated deployment the
 * project started with; it is not a second identity while a session exists, because the token and
 * the addressed learner would then disagree and the API would answer 404 by policy.
 */
export function createEnvLearnerIdentity(): LearnerIdentity {
  return {
    async getLearnerId() {
      // The BFF writes the learner id the API session belongs to. The environment value remains
      // the fallback for the mocked/unauthenticated deployment described below.
      const fromSession = (await cookies()).get(SESSION_LEARNER_COOKIE)?.value?.trim();
      return fromSession !== undefined && fromSession.length > 0
        ? fromSession
        : getServerEnv().ITS_LEARNER_ID;
    },
  };
}

/**
 * The credential presented to the platform.
 *
 * A login writes the API's RS256 access token to an httpOnly cookie and it is presented as-is.
 * When no session cookie exists, `ITS_API_TOKEN` is used — the server-to-server deployment.
 * With both empty this returns `null`, no `Authorization` header is sent, and every protected
 * call answers `401`, which the UI renders as an "unauthorized" state rather than as data.
 */
export function createEnvAccessTokenProvider(): AccessTokenProvider {
  return {
    async getAccessToken() {
      // The token minted by the login flow wins over the environment token: it is the credential
      // whose `sub` matches the learner the cookies address. `ITS_API_TOKEN` stays as the
      // server-to-server/mock fallback.
      const fromSession = (await cookies()).get(SESSION_TOKEN_COOKIE)?.value?.trim();
      if (fromSession !== undefined && fromSession.length > 0) return fromSession;
      return getServerEnv().ITS_API_TOKEN;
    },
  };
}
