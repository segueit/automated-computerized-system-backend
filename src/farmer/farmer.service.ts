import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateFarmerDto } from 'src/dto/create-farmer.dto';
import { UpdatePackagesDto } from 'src/dto/update-packages.dto';
import { QrService } from 'src/qr/qr.service';

@Injectable()
export class FarmerService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly qrService: QrService,
  ) {}
  // ✅ POST - 'Create' Farmer Entry
  async create(storageId: string, createFarmerDto: CreateFarmerDto) {
    // Destructuring
    const {
      name,
      produce,
      dateOfArrival,
      numberOfPackages,
      daysToStore,
      farmCode,
    } = createFarmerDto;

    // If Storage Exists
    const storageExists = await this.databaseService.coldStorage.findUnique({
      where: {
        id: storageId,
      },
    });

    if (!storageExists) {
      throw new UnauthorizedException('Invalid Storage ID!');
    }

    // Creating QrCode Url
    const url = `http://yourapp.com?storageId:${storageId}`;
    const qrCodeSrc = await this.qrService.generateQrCode(url);

    try {
      // Saving the farmer details
      const farmerDetails = await this.databaseService.farmer.create({
        data: {
          name,
          produce,
          dateOfArrival,
          numberOfPackages,
          daysToStore,
          farmCode,
          storageId,
          qrCode: qrCodeSrc,
        },
      });
      return {
        Message: 'Farmer details saved successfully!',
        'Farmer Details': farmerDetails,
      };
    } catch (error) {
      console.error('Error saving farmer details!\n', error);
      throw new InternalServerErrorException('Failed to save farmer details');
    }
  }

  // ✅ GET - Get Details of Specifc Farmer
  async getOne(farmerId: string, storageId: string) {
    // Validating storageId, farmerId and relation between storageId and farmerId
    const storage = await this.databaseService.coldStorage.findUnique({
      where: { id: storageId },
    });
    if (!storage) {
      throw new UnauthorizedException('Invalid Storage ID!');
    }
    const farmer = await this.databaseService.farmer.findUnique({
      where: { id: farmerId },
    });
    if (!farmer) {
      throw new NotFoundException('Farmer not found!');
    }
    if (farmer.storageId !== storageId) {
      throw new ForbiddenException('Unauthorized fetch attempt!');
    }
    return {
      Message: 'Farmer details fetched successfully!',
      FarmerDetails: farmer,
    };
  }

  // ✅ DELETE - Delete Farmer Details
  async delete(storageId: string, farmerId: string) {
    // Validating storageId, farmerId and relation between storageId and farmerId
    const storage = await this.databaseService.coldStorage.findUnique({
      where: { id: storageId },
    });
    if (!storage) {
      throw new UnauthorizedException('Invalid Storage ID!');
    }
    const farmer = await this.databaseService.farmer.findUnique({
      where: { id: farmerId },
    });
    if (!farmer) {
      throw new NotFoundException('Farmer not found!');
    }
    if (farmer.storageId !== storageId) {
      throw new ForbiddenException('Unauthorized delete attempt!');
    }
    await this.databaseService.farmer.delete({
      where: { id: farmerId },
    });

    return { Message: 'Farmer has been deleted successfully!' };
  }

  // ✅ PUT - Update Number of Packages
  async updatePackages(
    storageId: string,
    farmerId: string,
    updatePackageDto: UpdatePackagesDto,
  ) {
    //Destructuring email
    const { numberOfPackages, remarks } = updatePackageDto;

    // Validating storageId, farmerId and relation between storageId and farmerId
    const storage = await this.databaseService.coldStorage.findUnique({
      where: { id: storageId },
    });
    if (!storage) {
      throw new UnauthorizedException('Invalid Storage ID!');
    }
    const farmer = await this.databaseService.farmer.findUnique({
      where: { id: farmerId },
    });
    if (!farmer) {
      throw new NotFoundException('Farmer not found!');
    }
    if (farmer.storageId !== storageId) {
      throw new ForbiddenException('Unauthorized update attempt!');
    }

    const oldNumberOfPackages = farmer.numberOfPackages;
    // Only proceed if there's an actual change
    if (oldNumberOfPackages !== numberOfPackages) {
      const logEntry = {
        action: oldNumberOfPackages > numberOfPackages ? 'Removed' : 'Added',
        oldValue: oldNumberOfPackages,
        newValue: numberOfPackages,
        timestamp: new Date().toISOString(),
        remarks: remarks ?? 'N/A',
      };

      const existingLog = await this.databaseService.updateLogs.findUnique({
        where: {
          farmerId,
        },
      });

      if (existingLog) {
        await this.databaseService.updateLogs.update({
          where: {
            farmerId,
          },
          data: {
            logs: [...(existingLog.logs as any[]), logEntry],
          },
        });
      } else {
        await this.databaseService.updateLogs.create({
          data: {
            farmerId,
            logs: [logEntry],
          },
        });
      }

      await this.databaseService.farmer.update({
        where: {
          id: farmerId,
        },
        data: {
          numberOfPackages,
        },
      });
      return {
        Message: `Number of Packages ${logEntry.action} successfully.`,
        oldValue: oldNumberOfPackages,
        newValue: numberOfPackages,
        remarks,
      };
    }
    return {
      message: 'No change in number of packages. No update performed.',
    };
  }

  // ✅ Get logs for specific farmer
  async getLogs(farmerId: string) {
    // Validating if farmer exists
    const farmerExist = await this.databaseService.farmer.findUnique({
      where: {
        id: farmerId,
      },
    });
    if (!farmerExist) {
      throw new BadRequestException('Invalid Farmer ID.');
    }

    // Validating if log exists
    const logExists = await this.databaseService.updateLogs.findUnique({
      where: {
        farmerId,
      },
    });
    if (!logExists) {
      return {
        Message: 'No actions have been performerd yet ',
      };
    }

    // Response
    return {
      Message: 'Logs fetched successfully!',
      Logs: logExists,
    };
  }
}
