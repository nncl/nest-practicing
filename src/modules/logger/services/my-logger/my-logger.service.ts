import { Inject, Injectable, LoggerService } from '@nestjs/common';

import * as winston from 'winston';
import { IPubSubService } from '../../dto/pub-sub';

@Injectable()
export class MyLoggerService implements LoggerService {
  private logger: winston.Logger;

  private readonly pubSubTopic = 'logs';

  constructor(
    @Inject('IPubSubService') private readonly pubSubService: IPubSubService,
  ) {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
      ],
    });
  }

  async log(message: string, context?: string) {
    this.logger.info(message);
    await this.pubSubService.publishLog(this.pubSubTopic, {
      level: 'info',
      message,
      context,
    });
  }

  async error(message: string, trace: string, context?: string) {
    this.logger.error(message);
    await this.pubSubService.publishLog(this.pubSubTopic, {
      level: 'error',
      message,
      trace,
      context,
    });
  }

  async warn(message: string, context?: string) {
    this.logger.warn(message);
    await this.pubSubService.publishLog(this.pubSubTopic, {
      level: 'warn',
      message,
      context,
    });
  }
}
