import { Test, TestingModule } from '@nestjs/testing';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';

describe('FarmerController', () => {
  let controller: FarmerController;

  const placeholderValue = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmerController],
      providers: [FarmerService],
    })
      .overrideProvider(FarmerService)
      .useValue(placeholderValue)
      .compile();

    controller = module.get<FarmerController>(FarmerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
