/**
 * The five learner-scoped operations, booted the way the deployment boots them.
 *
 * Two integration specs measure these routes over HTTP — `learner-scope-rls.spec.ts` measures the
 * **status** (A5b: the 404 is the policy's answer) and `learner-routes-bodies.spec.ts` measures the
 * **body** (A7: what each response is a function of). Both need the same thing before they can
 * measure anything: the four controllers with the real guard, the real pipes, the real error filter,
 * and a credential the guard will actually verify.
 *
 * That shared thing lives here rather than in either spec, because *which modules and providers make
 * up the learner-scoped surface* is one decision and two copies of it are two answers. A route that
 * moves module, or a provider that gains a dependency, would otherwise have to be fixed twice — and
 * the second copy would be the one nobody re-read.
 *
 * What is deliberately **not** here: the connection's role. `learner_isolation` is
 * `FOR ALL TO its_platform_app`, and a table's owner bypasses its own policies (`FORCE ROW LEVEL
 * SECURITY` is set by no table in this schema), so whether the harness's connection is left as its
 * owner or switched with `SET ROLE` decides *what the routes can see*. The caller decides that, and
 * each spec records what it chose and why — see `reports/api/fase-5b.md` §4.2.
 *
 * The credential is a real RS256 token verified against a real JWKS (`tests/helpers/tokens.ts`),
 * never a mock verifier: a mock asserts that the guard calls *something*, and the guard is not what
 * these files are testing.
 */

import { Module } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'net';
import { DataSource } from 'typeorm';

import { configureApp } from '../../src/app.setup.js';
import { PgSessionContext } from '../../src/infrastructure/persistence/pg-session-context.js';
import { LearnerProfileRepository } from '../../src/infrastructure/repositories/learner-profile.repository.js';
import { LearnerRepository } from '../../src/infrastructure/repositories/learner.repository.js';
import { TOKEN_VERIFIER } from '../../src/modules/auth/tokens.js';
import { tokenVerifierFromEnv } from '../../src/infrastructure/auth/token-verifier-from-env.js';
import { CurriculumController } from '../../src/modules/curriculum/curriculum.controller.js';
import { CurriculumService } from '../../src/modules/curriculum/curriculum.service.js';
import { LearnerScopeService } from '../../src/modules/learners/learner-scope.service.js';
import { LearnersController } from '../../src/modules/learners/learners.controller.js';
import { LearnersService } from '../../src/modules/learners/learners.service.js';
import { PlacementController } from '../../src/modules/placement/placement.controller.js';
import { PlacementService } from '../../src/modules/placement/placement.service.js';
import { PracticeController } from '../../src/modules/practice/practice.controller.js';
import { PracticeService } from '../../src/modules/practice/practice.service.js';
import {
  authorization,
  clearOidcEnv,
  setOidcEnv,
  startTokenFixture,
  type TokenFixture,
} from './tokens.js';

/**
 * The four modules whose controllers answer the five learner-scoped routes, composed into one
 * module. `DataSource` comes from the outside because a role is a property of the connection the
 * application actually uses — the harness's own, deliberately (`learner-scope-rls.spec.ts` §“Both
 * modes”, `reports/api/fase-5b.md` §4.2).
 */
export function learnerRoutesModule(dataSource: DataSource): new () => unknown {
  @Module({
    controllers: [
      LearnersController,
      CurriculumController,
      PlacementController,
      PracticeController,
    ],
    providers: [
      LearnersService,
      CurriculumService,
      PlacementService,
      PracticeService,
      LearnerScopeService,
      LearnerRepository,
      // A7b: `LearnersService` reads the profile's four sources through this one.
      LearnerProfileRepository,
      PgSessionContext,
      // The token is the class: `LearnerRepository` and `PgSessionContext` both ask for `DataSource`.
      { provide: DataSource, useValue: dataSource },
      // Provide TOKEN_VERIFIER for the global guard (tests use real JWKS fixture via OIDC env vars)
      {
        provide: TOKEN_VERIFIER,
        useFactory: () => tokenVerifierFromEnv(),
      },
    ],
  })
  class LearnerRoutesHttpModule {}

  return LearnerRoutesHttpModule;
}

export interface LearnerRoutesApp {
  /** `http://127.0.0.1:<ephemeral port>` — the app listens on port 0, so two specs cannot collide. */
  readonly base: string;
  /** The JWKS fixture the application is verifying against, for a spec that needs to mint a token. */
  readonly fixture: TokenFixture;
  /** The header a caller presents, for a real RS256 token whose `sub` is `subject`. */
  auth(subject: string, scopes?: readonly string[]): Promise<Record<string, string>>;
  close(): Promise<void>;
}

/** `learner:self` — the scope every route in this module requires (ADR-038 D2). */
export const LEARNER_SELF_SCOPE = 'learner:self';

/**
 * Boot the module above through `configureApp` — the composition root `main.ts` calls — so the
 * guard, the pipes and the error filter are the deployed ones, and publish a real JWKS the
 * application fetches and verifies against.
 */
export async function startLearnerRoutesApp(dataSource: DataSource): Promise<LearnerRoutesApp> {
  const fixture = await startTokenFixture();
  setOidcEnv(fixture);

  const app: INestApplication = await NestFactory.create(
    learnerRoutesModule(dataSource) as never,
    { logger: false },
  );
  configureApp(app);
  await app.listen(0);
  const { port } = app.getHttpServer().address() as AddressInfo;

  return {
    base: `http://127.0.0.1:${port}`,
    fixture,
    auth: async (subject: string, scopes: readonly string[] = [LEARNER_SELF_SCOPE]) =>
      authorization(await fixture.accessToken(subject, [...scopes])),
    close: async () => {
      await app.close();
      clearOidcEnv();
      await fixture.close();
    },
  };
}
