import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

// FIXME
describe.only(AuthGuard.name, () => {
  let authGuard: AuthGuard;

  beforeEach(() => {
    authGuard = new AuthGuard();
  });

  it('should allow access when token is present', () => {
    const mockContext = createMockExecutionContext('Bearer valid-token');

    const result = authGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when token is missing', () => {
    const mockContext = createMockExecutionContext(null);

    expect(() => authGuard.canActivate(mockContext)).toThrow(
      UnauthorizedException,
    );
    expect(() => authGuard.canActivate(mockContext)).toThrow(
      'Token is missing',
    );
  });

  it('should throw UnauthorizedException when token is empty', () => {
    const mockContext = createMockExecutionContext('');

    expect(() => authGuard.canActivate(mockContext)).toThrow(
      UnauthorizedException,
    );
    expect(() => authGuard.canActivate(mockContext)).toThrow(
      'Token is missing',
    );
  });

  // Helper function to create a mock ExecutionContext
  function createMockExecutionContext(token: string | null): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: token,
          },
        }),
      }),
    } as unknown as ExecutionContext;
  }
});
