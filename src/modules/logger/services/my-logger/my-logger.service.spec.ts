import { Test, TestingModule } from '@nestjs/testing';
import { IPubSubService } from '../../dto/pub-sub';
import { MyLoggerService } from './my-logger.service';

describe(MyLoggerService.name, () => {
  let service: MyLoggerService;
  let pubSubServiceMock: Partial<IPubSubService>;

  beforeEach(async () => {
    pubSubServiceMock = {
      publishLog: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyLoggerService,
        {
          provide: 'IPubSubService',
          useValue: pubSubServiceMock,
        },
      ],
    }).compile();

    service = module.get<MyLoggerService>(MyLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
