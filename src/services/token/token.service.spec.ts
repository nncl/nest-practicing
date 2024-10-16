import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe(TokenService.name, () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the token correctly', () => {
    const testToken = 'test-token';
    service.setToken(testToken);

    expect(service.getToken()).toBe(testToken);
  });

  it('should get the token correctly', () => {
    const testToken = 'another-test-token';
    service.setToken(testToken);

    const result = service.getToken();
    expect(result).toBe(testToken);
  });

  it('should return undefined when no token is set', () => {
    const result = service.getToken();

    expect(result).toBeUndefined();
  });
});
