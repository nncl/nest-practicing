import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers(): Promise<string[]> {
    return this.appService.findAll();
  }

  @Get(':id')
  getUserById(@Param() params: any) {
    return this.appService.findOne(params.id);
  }
}
