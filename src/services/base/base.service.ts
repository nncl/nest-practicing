import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { map, Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable()
export class BaseService {
  private readonly logger = new Logger(BaseService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly tokenStorageService: TokenService,
  ) {
    // Setup Axios interceptor to automatically add token to headers
    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.tokenStorageService.getToken();

        this.logger.log('Token', token);

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  protected request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    config?: AxiosRequestConfig,
  ): Observable<T> {
    return this.httpService[method]<T>(url, config).pipe(
      map((response: AxiosResponse<T>) => response.data),
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return this.request<T>('get', url, config);
  }
}
