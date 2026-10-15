import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONSTITUTION.md §4.4 (prefix + versioning), §4.6 (correlation id), §4.3 (the error filter):
  // `configureApp` is the composition root. It is exported so the integration tests can build an
  // application through the same calls — `npm run contract:gate` reads this file and
  // `src/app.setup.ts` together, and fails if `main.ts` stops reaching the configuration.
  configureApp(app);

  const port = Number(process.env['PORT'] ?? 3000);
  await app.listen(port);
  console.log(`🚀 ITS Platform listening on http://localhost:${port} (API surface: /api/v1)`);
}

bootstrap();
