/**
 * The composition root — everything the API applies to itself, in one place.
 *
 * It lives outside `main.ts` so that the pipeline **the integration tests exercise is the pipeline
 * that ships**. `tests/integration/error-response.spec.ts` builds a Nest application, calls this
 * function, and asserts the served responses; a copy of the configuration inside the test would
 * have asserted the copy. `npm run contract:gate` reads this file alongside `main.ts` for the §4.4
 * rules (controls N-16, N-17, N-19 in `tests/contract/gate.spec.ts`), and `main.ts` must reach it.
 */

import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';

import { ProblemExceptionFilter } from './common/filters/problem-exception.filter.js';
import { correlationIdMiddleware } from './common/http/correlation.js';

export function configureApp(app: INestApplication): INestApplication {
  // CONSTITUTION.md §4.4 — URL path versioning is mandatory and is the only
  // permitted scheme; header and query versioning are prohibited. The resulting
  // surface is `/api/v1/<controller>/<route>`: NestJS inserts the version
  // segment AFTER the global prefix.
  //
  // The two probes are excluded from the prefix and are VERSION_NEUTRAL in
  // HealthController, so they remain at `/health` and `/ready`. They are
  // consumed by the orchestrator and by Kong, they are not a versioned API
  // surface, and `npm run contract:gate` exempts them for exactly this reason.
  // `iac/kong/kong.yml` and `scripts/kong-config-check.mjs` (assertions 6 and 7)
  // encode the same split; the same gate fails if this prefix disappears.
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'ready', method: RequestMethod.GET },
    ],
  });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Before the pipes and the filter: it fills `req.correlationId`, which the error filter reads
  // for `Problem.request_id`, and it sets the response header for every response (§4.6) — including
  // the ones this filter never sees.
  app.use(correlationIdMiddleware);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // The only place an error body is built (P1.17).
  app.useGlobalFilters(new ProblemExceptionFilter());

  app.enableCors({
    origin: (process.env['CORS_ORIGIN'] ?? 'http://localhost:3000').split(','),
    credentials: true,
  });

  return app;
}
