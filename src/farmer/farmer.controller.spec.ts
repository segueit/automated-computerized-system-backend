import { Test, TestingModule } from '@nestjs/testing';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateFarmerDto } from 'src/dto/create-farmer.dto';
import { UpdatePackagesDto } from 'src/dto/update-packages.dto';
import { ExecutionContext } from '@nestjs/common';

const mockFarmerService = {
  create: jest.fn(),
  getOne: jest.fn(),
  getLogs: jest.fn(),
  delete: jest.fn(),
  updatePackages: jest.fn(),
};

describe('FarmerController', () => {
  let controller: FarmerController;

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmerController],
      providers: [
        {
          provide: FarmerService,
          useValue: mockFarmerService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<FarmerController>(FarmerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct arguments', async () => {
      const dto: CreateFarmerDto = {
        name: 'John Doe',
        produce: 'Tomatoes',
        dateOfArrival: new Date().toISOString(),
        numberOfPackages: 10,
        daysToStore: 5,
        farmCode: 12,
      };
      const req = { storageId: 'storage123' };
      const result = { Message: 'Success' };

      mockFarmerService.create.mockResolvedValue(result);
      const res = await controller.create(dto, req);

      expect(mockFarmerService.create).toHaveBeenCalledWith('storage123', dto);
      expect(res).toEqual(result);
    });
  });

  describe('getOne', () => {
    it('should return farmer details', async () => {
      const req = { storageId: 'storage123' };
      const result = { Message: 'Fetched' };
      mockFarmerService.getOne.mockResolvedValue(result);

      const res = await controller.getOne('farmer123', req);

      expect(mockFarmerService.getOne).toHaveBeenCalledWith(
        'farmer123',
        'storage123',
      );
      expect(res).toEqual(result);
    });
  });

  describe('getLogs', () => {
    it('should return logs for farmer', async () => {
      const result = { Message: 'Logs fetched successfully!', Logs: [] };
      mockFarmerService.getLogs.mockResolvedValue(result);

      const res = await controller.getLogs('farmer123');

      expect(mockFarmerService.getLogs).toHaveBeenCalledWith('farmer123');
      expect(res).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should call delete service', async () => {
      const req = { storageId: 'storage123' };
      const result = { Message: 'Deleted successfully' };
      mockFarmerService.delete.mockResolvedValue(result);

      const res = await controller.delete('farmer123', req);

      expect(mockFarmerService.delete).toHaveBeenCalledWith(
        'storage123',
        'farmer123',
      );
      expect(res).toEqual(result);
    });
  });

  describe('update', () => {
    it('should call updatePackages with correct data', async () => {
      const dto: UpdatePackagesDto = {
        numberOfPackages: 15,
        remarks: 'Update',
      };
      const req = { storageId: 'storage123' };
      const result = { Message: 'Updated' };

      mockFarmerService.updatePackages.mockResolvedValue(result);

      const res = await controller.update('farmer123', req, dto);

      expect(mockFarmerService.updatePackages).toHaveBeenCalledWith(
        'storage123',
        'farmer123',
        dto,
      );
      expect(res).toEqual(result);
    });
  });
});
