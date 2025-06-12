import { IsISO8601, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFarmerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  produce: string;

  @IsISO8601()
  @IsNotEmpty()
  dateOfArrival: string;

  @IsNumber()
  numberOfPackages: number;

  @IsNumber()
  daysToStore: number;

  @IsNumber()
  farmCode: number;
}
