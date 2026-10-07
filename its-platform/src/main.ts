import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { ProblemExceptionFilter } from './common/filters/problem-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  console.log(`🚀 ITS Platform listening on http://localhost:${port}`);
}

bootstrap();
