import { ValidationError } from 'class-validator';

export class ValidationFormatter {
  static format(errors: ValidationError[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
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
