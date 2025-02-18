import { Test, TestingModule } from '@nestjs/testing';
import { ChildTwoController } from './child-two.controller';

describe('ChildTwoController', () => {
  let controller: ChildTwoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildTwoController],
    }).compile();

    controller = module.get<ChildTwoController>(ChildTwoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
