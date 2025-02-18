import { Controller, Get } from '@nestjs/common';
import { PARENT_BASE_PATH } from '../../parent.constants';

@Controller(`${PARENT_BASE_PATH}/child`)
export class ChildController {
  @Get()
  get() {
    return `hello child`;
  }
}
