import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class GroupDto {
  @ApiProperty({
    type: 'string',
    example: 'group IV',
    description: 'group name',
  })
  @IsNotEmpty({ message: 'Iltimos, guruh nomini kiriting!' })
  @IsString({ message: 'Guruh nomi matn shaklida kiritilishi zarur!' })
  name: string;

  @ApiProperty({
    type: 'date',
    example: '16.02.2015',
    description: 'group start date',
  })
  @IsNotEmpty({ message: 'Iltimos, guruh ochilgan sanani kiriting!' })
  @IsDateString(
    {},
    { message: "Guruh ochilgan sana to'g'ri formatda kiritilishi zarur!" },
  )
  start_date: Date;
}
