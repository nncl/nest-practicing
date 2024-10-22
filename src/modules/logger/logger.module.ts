import { Module } from '@nestjs/common';
import { MyLoggerService } from './services/my-logger/my-logger.service';
import { LogTransportToken } from './tokens';
import { PubSubTransport } from './transports/pub-sub.transport';
import { ConfigService } from '@nestjs/config';
import { FakeTransport } from './transports/fake.transport';
import { LogTransport } from './transports/log.transport.interface';

@Module({
  providers: [
    MyLoggerService,
    {
      provide: LogTransportToken,
      useFactory: (config: ConfigService): LogTransport => {
        const env = config.get<string>('NODE_ENV') || 'development';

        if (env === 'development') {
          return new FakeTransport();
        }

        const projectId = config.get<string>('PUBSUB_PROJECT_ID');
        const logTopic = config.get<string>('PUBSUB_LOG_TOPIC');

        if (!projectId || !logTopic) {
          throw new Error('PUBSUB_PROJECT_ID and PUBSUB_LOG_TOPIC must be defined in the configuration.');
        }

        return new PubSubTransport(projectId, logTopic);
      },
      inject: [ConfigService],
    },
  ],
})
export class LoggerModule {}
