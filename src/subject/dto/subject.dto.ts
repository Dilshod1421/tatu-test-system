import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubjectDto {
  @ApiProperty({
    type: 'string',
    example: 'mathematics',
    description: 'subject title',
  })
  @IsNotEmpty({ message: 'Iltimos, fan nomini kiriting!' })
  @IsString({ message: 'Fan nomi matn shaklida kiritilishi zarur!' })
  title: string;
}
