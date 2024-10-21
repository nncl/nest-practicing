import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth/auth.guard';

describe(AppController.name, () => {
  let appController: AppController;
  let appService: AppService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(['user1', 'user2']),
            findOne: jest.fn().mockResolvedValue('user1'),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Mocking the AuthGuard
      .compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    cacheManager = app.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result = await appController.getUsers();
      expect(result).toEqual(['user1', 'user2']);
      expect(appService.findAll).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a single user', async () => {
      const result = await appController.getUserById({ id: '1' });
      expect(result).toEqual('user1');
      expect(appService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('Cache', () => {
    it('should remove cache by key', async () => {
      const cacheKey = 'users';

      await appController.clearCache();

      expect(cacheManager.del).toHaveBeenCalledWith(cacheKey);
    });
  });
});
