import { Module } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { QrModule } from 'src/qr/qr.module';

@Module({
  imports: [DatabaseModule, QrModule],
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}
