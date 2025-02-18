import { Controller, Get } from '@nestjs/common';

@Controller('parent')
export class ParentController {
  @Get()
  get() {
    return `hello parent`;
  }
}
