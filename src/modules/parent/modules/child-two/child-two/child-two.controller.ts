import { Controller, Get } from '@nestjs/common';
import { PARENT_BASE_PATH } from '../../parent.constants';

@Controller(`${PARENT_BASE_PATH}/child-two`)
export class ChildTwoController {
  @Get()
  get() {
    return `hello child 2`;
  }
}
