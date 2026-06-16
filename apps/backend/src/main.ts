import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser') as typeof import('cookie-parser');
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  if (!process.env.TRANSLATION_SERVICE_URL) {
    logger.warn(
      'TRANSLATION_SERVICE_URL not set — defaulting to http://localhost:8000',
    );
  }

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  new Logger('Bootstrap').log(`Backend running on :${port}`);
}
bootstrap().catch((err) => {
  console.error('Fatal startup error', err);
  process.exit(1);
});
