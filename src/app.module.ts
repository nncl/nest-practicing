import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenInterceptor } from './interceptors/token/token.interceptor';
import { BaseService } from './services/base/base.service';
import { TokenService } from './services/token/token.service';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
    CacheModule.register({
      ttl: 60 * 1000,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BaseService,
    TokenService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
