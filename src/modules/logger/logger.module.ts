import { Module } from '@nestjs/common';
import { MyLoggerService } from './services/my-logger/my-logger.service';
import { PubSubService } from './services/pub-sub/pub-sub.service';

@Module({
  providers: [
    MyLoggerService,
    {
      provide: 'IPubSubService',
      useClass: PubSubService,
    },
  ],
})
export class LoggerModule {}
