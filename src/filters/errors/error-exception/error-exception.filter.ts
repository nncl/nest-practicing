import Bugsnag from '@bugsnag/js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      // Ensure `message` is always a string
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'message' in responseBody
      ) {
        message = Array.isArray(responseBody.message)
          ? responseBody.message.join(', ')
          : String(responseBody.message);
      } else {
        message = exception.message;
      }
    }
    // Ensure exception is an Error and message is a string
    else if (
      exception instanceof Error &&
      typeof exception.message === 'string'
    ) {
      message = exception.message;
    }

    // Log to Bugsnag
    Bugsnag.notify(exception as Error);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
