import { Controller, Get } from '@nestjs/common';

@Controller('parent/child')
export class ChildController {
  @Get()
  get() {
    return `hello child`;
  }
}
