import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { TokenService } from '../../services/token/token.service';
import { TokenInterceptor } from './token.interceptor';

describe(TokenInterceptor.name, () => {
  let tokenInterceptor: TokenInterceptor;
  let tokenService: TokenService;
  let mockContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    // Create a real instance of TokenService
    tokenService = new TokenService();

    // Spy on the setToken method to track its calls
    jest.spyOn(tokenService, 'setToken');

    tokenInterceptor = new TokenInterceptor(tokenService);

    // Mocking the ExecutionContext and CallHandler
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer fakeToken' },
        }),
      }),
    } as unknown as ExecutionContext;

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of(null)), // Simulate the next.handle() call
    };
  });

  it('should call TokenService.setToken with the correct token', () => {
    tokenInterceptor.intercept(mockContext, mockCallHandler);

    expect(tokenService.setToken).toHaveBeenCalledWith('Bearer fakeToken');
  });

  it('should pass the request to the next handler', () => {
    const nextHandleSpy = jest.spyOn(mockCallHandler, 'handle');

    tokenInterceptor.intercept(mockContext, mockCallHandler);

    // Check that next.handle() was called
    expect(nextHandleSpy).toHaveBeenCalled();
  });

  it('should store the token in TokenService', () => {
    tokenInterceptor.intercept(mockContext, mockCallHandler);

    expect(tokenService.getToken()).toBe('Bearer fakeToken');
  });
});
