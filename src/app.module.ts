import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseService } from './services/base/base.service';
import { TokenService } from './services/token/token.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BaseService,
    TokenService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
