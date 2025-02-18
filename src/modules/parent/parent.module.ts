import { Module } from '@nestjs/common';
import { ChildTwoModule } from './modules/child-two/child-two.module';
import { ChildModule } from './modules/child/child.module';
import { ParentController } from './modules/parent.controller';

@Module({
  controllers: [ParentController],
  imports: [ChildModule, ChildTwoModule],
})
export class ParentModule {}
