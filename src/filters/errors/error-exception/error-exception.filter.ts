import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ValidationFormatter } from '../../../utils/validation-formatter';
import { AppException } from '../exceptions/app-exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: Record<string, string[]> | null = null;

    if (
      exception instanceof AppException ||
      exception instanceof HttpException
    ) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'message' in responseBody
      ) {
        const messageContent = responseBody.message;
        message = Array.isArray(messageContent)
          ? messageContent.join(', ')
          : String(messageContent);

        if (
          exception instanceof BadRequestException &&
          Array.isArray(messageContent)
        ) {
          errors = ValidationFormatter.format(
            messageContent as ValidationError[],
          );
          message = 'Validation failed. Check errors field for details.';
          status = HttpStatus.BAD_REQUEST;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
