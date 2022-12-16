import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './filters/api-exception.filter';
import { createLogger } from './logger/createLogger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createLogger(),
  });

  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(3000);
}
bootstrap();
