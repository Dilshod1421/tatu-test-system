import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddGroupDto {
  @ApiProperty({
    type: 'string',
    example: '1234j-asdf98-adskfja',
    description: 'id of staff',
  })
  @IsNotEmpty({ message: 'Iltimos, xodim ID sini biriktiring!' })
  @IsString({ message: "Xodim ID si matn shaklida bo'lishi zarur!" })
  staff_id: string;

  @ApiProperty({
    type: 'string',
    example: '98',
    description: 'name of group',
  })
  @IsNotEmpty({ message: 'Iltimos, guruh nomini kiriting!' })
  @IsString({ message: "Guruh nomi matn shaklida bo'lishi zarur!" })
  name: string;
}
