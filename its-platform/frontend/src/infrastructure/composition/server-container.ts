import 'server-only';

import { createUseCases, type UseCases } from '@/application/container';
import { HttpClient } from '../api/http-client';
import { DirectApiGateway } from '../api/direct-gateway.server';
import type { ApiTransport } from '../api/api-transport';
import { HttpContentRepository } from '../api/repositories/http-content-repository';
import { HttpCurriculumRepository } from '../api/repositories/http-curriculum-repository';
import { HttpLearnerRepository } from '../api/repositories/http-learner-repository';
import { HttpPlacementRepository } from '../api/repositories/http-placement-repository';
import { HttpPracticeRepository } from '../api/repositories/http-practice-repository';
import { HttpSpeechRepository } from '../api/repositories/http-speech-repository';
import { getServerEnv } from '../env/server-env';
import { createEnvAccessTokenProvider, createEnvLearnerIdentity } from '../identity/env-identity.server';

/**
 * The composition root for server code — the one module allowed to know every layer.
 *
 * It is `server-only`, so if a Client Component ever imports it (directly or through a
 * shared barrel), the build fails rather than shipping the base URL and the token into
 * the browser bundle.
 *
 * Constructed per call rather than held in a module-level singleton. The objects are
 * trivial and `getServerEnv()` is already cached; a singleton here would be shared across
 * requests, which is exactly the kind of state that becomes a tenant leak later.
 */
export interface ServerContext {
  readonly useCases: UseCases;
  /** Resolved server-side. No page, action or component ever reads an env variable. */
  readonly learnerId: string;
}

export function createServerApiTransport(): ApiTransport {
  const env = getServerEnv();
  const tokenProvider = createEnvAccessTokenProvider();

  return new DirectApiGateway({
    baseUrl: env.ITS_API_BASE_URL,
    getAccessToken: () => tokenProvider.getAccessToken(),
    httpClient: new HttpClient({ timeoutMs: env.ITS_API_TIMEOUT_MS }),
  });
}

export function createServerUseCases(transport: ApiTransport = createServerApiTransport()): UseCases {
  return createUseCases({
    learners: new HttpLearnerRepository(transport),
    curriculum: new HttpCurriculumRepository(transport),
    content: new HttpContentRepository(transport),
    practice: new HttpPracticeRepository(transport),
    placement: new HttpPlacementRepository(transport),
    speech: new HttpSpeechRepository(transport),
  });
}

export async function getServerContext(): Promise<ServerContext> {
  // Deliberately sequential and cheap: identity first, because a misconfigured
  // `ITS_LEARNER_ID` should fail before any request is made against the API.
  const learnerId = await createEnvLearnerIdentity().getLearnerId();
  return { useCases: createServerUseCases(), learnerId };
}
