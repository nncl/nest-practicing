import { ConsoleLogger, Injectable } from '@nestjs/common';

import * as winston from 'winston';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  log(message: any, context?: string) {
    winston.log('info', message);
    super.log(message, context);
  }
}
