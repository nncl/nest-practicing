import { Controller, Get } from '@nestjs/common';
import { PARENT_BASE_PATH } from './parent.constants';

@Controller(PARENT_BASE_PATH)
export class ParentController {
  @Get()
  get() {
    return `hello parent`;
  }
}
