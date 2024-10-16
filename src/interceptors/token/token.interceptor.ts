import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly tokenStorageService: TokenService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    this.tokenStorageService.setToken(token);

    return next.handle();
  }
}
