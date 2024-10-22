import { Inject, Injectable, LoggerService } from '@nestjs/common';

import * as winston from 'winston';
import { LogTransportToken } from '../../tokens';
import { LogLevel, LogTransport } from '../../transports/log.transport.interface';

@Injectable()
export class MyLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(
    @Inject(LogTransportToken) private readonly logTransport: LogTransport,
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
    await this.logTransport.send({
      level: LogLevel.INFO,
      message,
      context,
    });
  }

  async error(message: string, trace: string, context?: string) {
    this.logger.error(message);
    await this.logTransport.send({
      level: LogLevel.ERROR,
      message,
      trace,
      context,
    });
  }

  async warn(message: string, context?: string) {
    this.logger.warn(message);
    await this.logTransport.send({
      level: LogLevel.WARN,
      message,
      context,
    });
  }
}
