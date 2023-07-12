import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class StaffDto {
  @ApiProperty({
    type: 'string',
    example: 'JohnDoe',
    description: 'login of staff',
  })
  @IsNotEmpty({ message: 'Iltimos, login kiriting!' })
  @IsString({ message: 'Login matn shaklida kiritilishi zarur!' })
  @MinLength(5, { message: "Login uzunligi 5 tadan kam bo'lmasligi zarur!" })
  @MaxLength(20, { message: "Login uzunligi 15 tadan ko'p bo'lmasligi zarur!" })
  login: string;

  @ApiProperty({
    type: 'string',
    example: 'JohnDoe1!',
    description: 'password of staff',
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
    example: 'admin',
    description: 'role of staff',
  })
  @IsNotEmpty({ message: 'Iltimos, rolini kiriting!' })
  @IsString({ message: 'Roli matn shaklida kiritlishi zarur!' })
  role: string;

  @ApiProperty({
    type: 'string',
    example: 'John Doe Smith',
    description: 'full name of staff',
  })
  @IsNotEmpty({ message: "Iltimos, to'liq ismingizni kiriting!" })
  @IsString({ message: "To'liq ism matn shaklida kiritilishi zarur!" })
  @MinLength(6, {
    message: "To'liq ism uzunligi 6 tadan kam bo'lmasligi zarur!",
  })
  @MaxLength(50, {
    message: "To'liq ism uzunligi 30 tadan ko'p bo'lmasligi zarur!",
  })
  full_name: string;

  @ApiProperty({
    type: 'string',
    example: '+998901234567',
    description: 'phone number of staff',
  })
  @IsNotEmpty({ message: 'Iltimos, telefon raqam kiritiing!' })
  @IsPhoneNumber('UZ', { message: "Telefon raqamini to'g'ri kiritiing!" })
  phone_number: string;
}
