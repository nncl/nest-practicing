import Bugsnag from '@bugsnag/js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  GlobalExceptionFilter
} from './filters/errors/error-exception/error-exception.filter';
import { MyLoggerService } from './modules/logger/services/my-logger/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const bugsnagApiKey = configService.get<string>('BUGSNAG_API_KEY') ?? '';

  // Bugsnag.start({
  //   apiKey: bugsnagApiKey,
  //   plugins: [BugsnagPluginExpress],
  // });

  app.useLogger(app.get(MyLoggerService));

  const bugsnagMiddleware = Bugsnag.getPlugin('express');
  if (bugsnagMiddleware) {
    app.use(bugsnagMiddleware.requestHandler);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);

  if (bugsnagMiddleware) {
    app.use(bugsnagMiddleware.errorHandler);
  }
}

bootstrap();
