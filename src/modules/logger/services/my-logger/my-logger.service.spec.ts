import { Test, TestingModule } from '@nestjs/testing';
import { MyLoggerService } from './my-logger.service';
import { LogTransport } from '../../transports/log.transport.interface';
import { LogTransportToken } from '../../tokens';

describe(MyLoggerService.name, () => {
  let service: MyLoggerService;
  let logTransportMock: LogTransport;

  beforeEach(async () => {
    logTransportMock = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyLoggerService,
        {
          provide: LogTransportToken,
          useValue: logTransportMock,
        },
      ],
    }).compile();

    service = module.get<MyLoggerService>(MyLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
