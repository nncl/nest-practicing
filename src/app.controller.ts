import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
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
