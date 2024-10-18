import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLoggerService } from './modules/logger/services/my-logger/my-logger.service';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginExpress from '@bugsnag/plugin-express';
import { ErrorExceptionFilter } from './filters/errors/error-exception/error-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const bugsnagApiKey = configService.get<string>('BUGSNAG_API_KEY') ?? '';

  Bugsnag.start({
    apiKey: bugsnagApiKey,
    plugins: [BugsnagPluginExpress],
  });

  app.useLogger(app.get(MyLoggerService));

  const bugsnagMiddleware = Bugsnag.getPlugin('express');
  if (bugsnagMiddleware) {
    app.use(bugsnagMiddleware.requestHandler);
  }

  app.useGlobalFilters(new ErrorExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);

  if (bugsnagMiddleware) {
    app.use(bugsnagMiddleware.errorHandler);
  }
}

bootstrap();
