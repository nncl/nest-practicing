import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from '../exceptions/app-exception';
import { GlobalExceptionFilter } from './error-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue({ url: '/test-route' }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle AppException correctly', () => {
    const exception = new AppException(
      'Custom App Error',
      HttpStatus.UNAUTHORIZED,
    );
    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 401,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Custom App Error',
    });
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException(
      'Custom error message',
      HttpStatus.FORBIDDEN,
    );
    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 403,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Custom error message',
    });
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
    filter.catch(exception, mockHost);

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
  });

  it('should handle generic errors correctly', () => {
    const exception = new Error('Unexpected failure');
    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Unexpected failure',
    });
  });

  it('should default to Internal Server Error for unknown exceptions', () => {
    const exception = {} as any;
    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      path: '/test-route',
      message: 'Internal Server Error',
    });
  });
});
