import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminIdDto {
  @ApiProperty({
    type: 'string',
    example: '23ihuhh234-sdfjfl23k',
    description: 'admin id',
  })
  @IsNotEmpty({ message: 'Iltimos, admin ID sini kiriting!' })
  @IsString({ message: 'Admin ID si matn shaklida kiritilisih zarur!' })
  admin_id: string;
}
