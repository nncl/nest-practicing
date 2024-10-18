import { Module } from '@nestjs/common';
import { MyLoggerService } from './services/my-logger/my-logger.service';

@Module({
  providers: [MyLoggerService],
})
export class LoggerModule {}
