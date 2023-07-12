import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  IsNumber,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';

export class StudentDto {
  @ApiProperty({
    type: 'string',
    example: 'adamsmith',
    description: "student's username",
  })
  @IsNotEmpty({ message: 'Iltimos, login kiriting!' })
  @IsString({ message: 'Login matn shaklida kiritilishi zarur!' })
  @MinLength(6, { message: "Login uzunligi 6 tadan kam bo'lmasligi zarur!" })
  @MaxLength(20, { message: "Login uzunligi 20 tadan ko'p bo'lmasligi zarur!" })
  login: string;

  @ApiProperty({
    type: 'string',
    example: 'AdamSmith0!',
    description: "student's password",
  })
  @IsNotEmpty({ message: 'Iltimos, parol kiriting!' })
  @IsStrongPassword(
    {},
    {
      message:
        "Parol uzunligi 8 tadan kam bo'lmasligi, 1 ta katta harf, 1 ta son va 1 ta belgi qantashishligi zarur!",
    },
  )
  password: string;

  @ApiProperty({
    type: 'string',
    example: 'John Doe Smith',
    description: "student's full name",
  })
  @IsNotEmpty({ message: "Iltimos, to'liq ismni kiriting!" })
  @IsString({ message: "To'liq ism matn shaklida kiritilishi zarur!" })
  full_name: string;

  @ApiProperty({
    type: 'number',
    example: '1',
    description: "student's group id",
  })
  @IsNotEmpty({ message: 'Iltimos, talabaga guruh ID sini biriktiring!' })
  @IsNumber({}, { message: "Guruh ID si son ko'rinishida bo'lishiligi zarur!" })
  group_id: number;

  @ApiProperty({
    type: 'string',
    example: '+998991112233',
    description: "student's phone number",
  })
  @IsNotEmpty({ message: 'Iltimos, telefon raqamini kiriting!' })
  @IsPhoneNumber('UZ', {
    message: "Telefon raqami to'g'ri formatda kiritilishi zarur!",
  })
  phone_number: string;
}
