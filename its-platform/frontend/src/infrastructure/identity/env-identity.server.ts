import 'server-only';

import type { AccessTokenProvider, LearnerIdentity } from '@/core';
import { getServerEnv } from '../env/server-env';

/**
 * The mocked learner identity, until ADR-013 closes.
 *
 * This is the single place the mock exists. Swapping it for the verified token's subject
 * later changes this file and nothing else — no use case, no component and no route
 * mentions an environment variable.
 */
export function createEnvLearnerIdentity(): LearnerIdentity {
  return {
    async getLearnerId() {
      return getServerEnv().ITS_LEARNER_ID;
    },
  };
}

/**
 * The credential presented to the platform.
 *
 * The platform is a Resource Server: it verifies tokens minted by an external IdP and
 * never issues one (ADR-013). With `ITS_API_TOKEN` empty this returns `null`, no
 * `Authorization` header is sent, and every protected call answers `401` — which the UI
 * renders as an "unauthorized" state. That is the honest outcome: a fabricated token
 * would make the whole flow look like it works.
 */
export function createEnvAccessTokenProvider(): AccessTokenProvider {
  return {
    async getAccessToken() {
      return getServerEnv().ITS_API_TOKEN;
    },
  };
}
