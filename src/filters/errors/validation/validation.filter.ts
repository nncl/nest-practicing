import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const responseBody = exception.getResponse();

    console.log({ responseBody });

    if (
      typeof responseBody === 'object' &&
      'message' in responseBody &&
      Array.isArray(responseBody.message)
    ) {
      const errors = this.formatErrors(responseBody.message);
      console.log({ errors });
      return response.status(400).json({ errors });
    }

    response.status(400).json(responseBody);
  }

  private formatErrors(
    validationErrors: ValidationError[],
  ): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    validationErrors.forEach((error) => {
      console.log({ error });
      if (!error.property || !error.constraints) {
        return; // Skip invalid entries
      }

      if (!formattedErrors[error.property]) {
        formattedErrors[error.property] = [];
      }

      Object.values(error.constraints).forEach((message) => {
        formattedErrors[error.property].push(message);
      });
    });

    console.log({ formattedErrors });

    return formattedErrors;
  }
}
