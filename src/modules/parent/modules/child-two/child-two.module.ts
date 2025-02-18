import { Module } from '@nestjs/common';
import { ChildTwoController } from './child-two/child-two.controller';

@Module({
  controllers: [ChildTwoController],
})
export class ChildTwoModule {}
