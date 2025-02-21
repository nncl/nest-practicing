import Bugsnag from '@bugsnag/js';
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

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';
    let errors: Record<string, string[]> | null = null;

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse &&
        Array.isArray(exceptionResponse.message)
      ) {
        errors = this.formatValidationErrors(
          exceptionResponse.message as ValidationError[],
        );
        message = 'Validation failed. Check errors field for details.';
        status = HttpStatus.BAD_REQUEST;
      } else {
        message = exception.message;
        status = exception.getStatus();
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

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
    } else if (
      exception instanceof Error &&
      typeof exception.message === 'string'
    ) {
      message = exception.message;
    }

    Bugsnag.notify(exception as Error);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errors ? { errors } : {}),
    });
  }

  private formatValidationErrors(
    validationErrors: ValidationError[],
  ): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    validationErrors.forEach((error) => {
      if (!error.property || !error.constraints) {
        return;
      }

      if (!formattedErrors[error.property]) {
        formattedErrors[error.property] = [];
      }

      Object.values(error.constraints).forEach((msg) => {
        formattedErrors[error.property].push(msg);
      });
    });

    return formattedErrors;
  }
}
