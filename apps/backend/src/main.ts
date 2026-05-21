import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  new Logger('Bootstrap').log(`Backend running on :${port}`);
}
bootstrap();
