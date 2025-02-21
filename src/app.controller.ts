import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
} from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth/auth.guard';
import Bugsnag from '@bugsnag/js';

const CACHE_USERS_KEY = 'users';

@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @CacheKey(CACHE_USERS_KEY)
  getUsers(): Promise<string[]> {
    return this.appService.findAll();
  }

  @Get(':id')
  getUserById(@Param() params: any) {
    return this.appService.findOne(params.id);
  }

  @Post('clear-cache')
  async clearCache() {
    await this.cacheManager.del(CACHE_USERS_KEY);
    return { message: 'Cache cleared successfully' };
  }

  @Post('error')
  async sendError(@Query('custom') custom: boolean) {
    if (custom) {
      return Bugsnag.notify(new Error('Custom error'), (event) => {
        event.addMetadata('custom', { key: 'value' });
      });
    }

    throw new AppException('Unhandled error', HttpStatus.BAD_REQUEST);
  }
}
