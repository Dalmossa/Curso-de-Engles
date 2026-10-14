import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { ProblemExceptionFilter } from './common/filters/problem-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  app.useGlobalFilters(new ProblemExceptionFilter());

  app.enableCors({
    origin: (process.env['CORS_ORIGIN'] ?? 'http://localhost:3000').split(','),
    credentials: true,
  });

  const port = Number(process.env['PORT'] ?? 3000);
  await app.listen(port);
  console.log(`🚀 ITS Platform listening on http://localhost:${port} (API surface: /api/v1)`);
}

bootstrap();
