import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginStaffDto {
  @ApiProperty({
    type: 'string',
    example: 'JohnDoe',
    description: 'login of the staff',
  })
  @IsNotEmpty({ message: 'Iltimos, login kiriting!' })
  login: string;

  @ApiProperty({
    type: 'string',
    example: 'JohnDoe1!',
    description: 'password of the staff',
  })
  @IsNotEmpty({ message: 'Iltimos, parol kiriting!' })
  password: string;
}
