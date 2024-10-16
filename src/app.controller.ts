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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth/auth.guard';

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

  @Post('clean-cache')
  async cleanCache() {
    await this.cacheManager.del(CACHE_USERS_KEY);
    return { message: 'Cache cleared successfully' };
  }
}
