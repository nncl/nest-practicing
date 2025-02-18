import { Module } from '@nestjs/common';
import { ChildController } from './child/child.controller';

@Module({
  controllers: [ChildController],
})
export class ChildModule {}
