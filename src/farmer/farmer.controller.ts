import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { CreateFarmerDto } from 'src/dto/create-farmer.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdatePackagesDto } from 'src/dto/update-packages.dto';

@UseGuards(AuthGuard)
@Controller('farmer')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}
  @Post('')
  async create(@Body() createFarmerDto: CreateFarmerDto, @Req() req) {
    return this.farmerService.create(req.storageId, createFarmerDto);
  }

  @Get(':farmerId')
  async getOne(@Param('farmerId') farmerId: string, @Req() req) {
    return this.farmerService.getOne(farmerId, req.storageId);
  }

  @Get(':farmerId/logs')
  async getLogs(@Param('farmerId') farmerId: string) {
    return this.farmerService.getLogs(farmerId);
  }

  @Delete(':farmerId/delete')
  async delete(@Param('farmerId') farmerId: string, @Req() req) {
    return this.farmerService.delete(req.storageId, farmerId);
  }

  @Put(':farmerId/edit')
  async update(
    @Param('farmerId') farmerId: string,
    @Req() req,
    @Body() updatePackageDto: UpdatePackagesDto,
  ) {
    return this.farmerService.updatePackages(
      req.storageId,
      farmerId,
      updatePackageDto,
    );
  }
}
