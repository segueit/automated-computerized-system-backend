import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePackagesDto {
  @IsNumber()
  @IsNotEmpty()
  numberOfPackages: number;

  @IsOptional()
  @IsString()
  remarks: string;
}
