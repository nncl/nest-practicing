import Bugsnag from '@bugsnag/js';
import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { GlobalExceptionFilter } from './error-exception.filter';

jest.mock('@bugsnag/js', () => ({
  notify: jest.fn(),
}));

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockHost = {
      switchToHttp: jest.fn(() => ({
        getResponse: jest.fn(() => mockResponse),
        getRequest: jest.fn(() => ({ url: '/test-route' })),
      })),
    };
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException(
      'Custom error message',
      HttpStatus.FORBIDDEN,
    );
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 403,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Custom error message',
    });

    expect(Bugsnag.notify).toHaveBeenCalledWith(exception);
  });

  it('should handle BadRequestException with validation errors', () => {
    const validationErrors = [
      { property: 'email', constraints: { isEmail: 'email must be an email' } },
      {
        property: 'username',
        constraints: { isString: 'username must be a string' },
      },
    ];

    const exception = new BadRequestException(validationErrors);
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Validation failed. Check errors field for details.',
      errors: {
        email: ['email must be an email'],
        username: ['username must be a string'],
      },
    });

    expect(Bugsnag.notify).toHaveBeenCalledWith(exception);
  });

  it('should handle generic errors correctly', () => {
    const exception = new Error('Unexpected failure');
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Unexpected failure',
    });

    expect(Bugsnag.notify).toHaveBeenCalledWith(exception);
  });

  it('should default to Internal Server Error for unknown exceptions', () => {
    const exception = {} as any;
    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Internal Server Error',
    });

    expect(Bugsnag.notify).toHaveBeenCalledWith(exception);
  });
});
