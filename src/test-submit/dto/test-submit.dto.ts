import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TestSubmitDto {
  @ApiProperty({
    type: 'boolean',
    example: 'true',
    description: 'student submitted test',
  })
  @IsNotEmpty({ message: 'Iltimos, test topshirilganini tasdiqlang!' })
  @IsBoolean({ message: "Test tasdiqlashi to'g'ri formatda bo'lishi kerak!" })
  is_submit: boolean;

  @ApiProperty({
    type: 'number',
    example: '26',
    description: 'student correct answers',
  })
  correct_answers: number;

  @ApiProperty({
    type: 'string',
    example: '2adsfkljfds-2kljdsaf-asdf',
    description: 'student id',
  })
  @IsNotEmpty({ message: 'Iltimos, talaba ID sini kiriting!' })
  @IsString({ message: "Talaba ID si matn shaklida bo'lishi zarur!" })
  student_id: string;

  @ApiProperty({
    type: 'number',
    example: '15',
    description: 'test group id',
  })
  @IsNotEmpty({ message: 'Iltimos, test ID sini kiriting!' })
  @IsNumber({}, { message: "Test ID si son shaklida bo'lishi zarur!" })
  test_group_id: number;
}
