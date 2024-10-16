import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth/auth.guard';

describe(AppController.name, () => {
  let appController: AppController;
  let appService: AppService;

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
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Mocking the AuthGuard
      .compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
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
});
