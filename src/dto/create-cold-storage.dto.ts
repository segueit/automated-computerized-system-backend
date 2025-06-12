import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateColdStorageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        'Input must be a comma seperated string of numbers!',
      );
    }
    const arr = value.split(',').map((v) => {
      const num = parseInt(v.trim(), 10);
      if (isNaN(num)) {
        throw new BadRequestException(`Invalid number: "${v.trim()}"`);
      }
      return num;
    });
    if (arr.length === 0) {
      throw new BadRequestException(
        'Input string must contain atleast one number!',
      );
    }
    return arr;
  })
  @IsArray()
  @IsInt({ each: true })
  codes: number[];

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character (!@#$%^&*)',
  })
  password: string;
}
