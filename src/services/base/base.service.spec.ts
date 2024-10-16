import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { of } from 'rxjs';
import { TokenService } from '../token/token.service';
import { BaseService } from './base.service';

describe(BaseService.name, () => {
  let service: BaseService;
  let httpService: HttpService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BaseService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              interceptors: {
                request: { use: jest.fn() }, // Mock Axios interceptor setup
              },
            },
            get: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            getToken: jest.fn().mockReturnValue('fakeToken'), // Mock token retrieval
          },
        },
      ],
    }).compile();

    service = module.get<BaseService>(BaseService);
    httpService = module.get<HttpService>(HttpService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
    expect(tokenService).toBeDefined();
  });

  it('should set up the Axios request interceptor to add the token', async () => {
    // Spy on the interceptor setup
    const interceptorUseSpy = jest.spyOn(
      httpService.axiosRef.interceptors.request,
      'use',
    );

    // Retrieve the interceptor function that was added
    const interceptorFunction = interceptorUseSpy.mock.calls[0][0];

    if (!interceptorFunction) {
      fail('Interceptor function was not defined');
    }

    const mockConfig: InternalAxiosRequestConfig = {
      headers: new AxiosHeaders(),
      url: '',
      method: 'get',
    };

    const modifiedConfig = await interceptorFunction(mockConfig);

    // Verify that the Authorization header is added
    expect(modifiedConfig.headers['Authorization']).toBe('Bearer fakeToken');
  });

  it('should call HttpService.get with the correct parameters', (done) => {
    const mockResponse = { data: { result: 'success' } };

    // httpService.get.mockReturnValue(of(mockResponse)); // Mock the HTTP response
    // Cast httpService.get as a Jest mock function and set up the mock return value
    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const url = 'https://api.example.com/resource';
    service.get(url).subscribe((result) => {
      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(url, undefined);
      done();
    });
  });
});
