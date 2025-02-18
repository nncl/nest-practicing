import { Controller, Get } from '@nestjs/common';

@Controller('parent/child-two')
export class ChildTwoController {
  @Get()
  get() {
    return `hello child 2`;
  }
}
