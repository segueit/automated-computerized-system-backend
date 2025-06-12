import { IsNotEmpty, IsString } from 'class-validator';

export class LoginColdStorageDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
