import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class StudentProfileDto {
  @ApiProperty({
    type: 'string',
    example: 'John Smith Doe',
    description: 'student full name',
  })
  @IsNotEmpty({ message: "Iltimos, to'liq ismni kiriting!" })
  @IsString({ message: "To'liq ism matn shaklida kiritilishi zarur!" })
  @MinLength(6, {
    message: "To'liq ism uzunligi 6 tada kam bo'lmasligi zarur!",
  })
  @MaxLength(50, {
    message: "To'liq ism uzunligi 50 tadan ko'p bo'lmasligi zarur!",
  })
  full_name: string;

  @ApiProperty({
    type: 'string',
    example: 'John Smith Doe',
    description: 'student full name',
  })
  @IsNotEmpty({ message: "Iltimos, to'liq ismni kiriting!" })
  @IsPhoneNumber('UZ', {
    message: "Telefon raqami to'g'ri formatda kiritilshi zarur!",
  })
  phone_number: string;

  @ApiProperty({
    type: 'string',
    example: 'adam@gmail.com',
    description: "student's email address",
  })
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'Adams',
    description: "student's telegram username",
  })
  telegram_username: string;
}
