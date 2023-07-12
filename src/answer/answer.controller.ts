import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnswerDto } from './dto/answer.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin.guard';

@ApiTags('answers')
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({ summary: 'Create a new answer' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() answerDto: AnswerDto) {
    return this.answerService.create(answerDto);
  }

  @ApiOperation({ summary: 'get all answers' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @ApiOperation({ summary: 'get answer by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.answerService.findOne(id);
  }

  @ApiOperation({ summary: 'update answer by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() answerDto: AnswerDto) {
    return this.answerService.update(id, answerDto);
  }

  @ApiOperation({ summary: 'delete answer by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.answerService.remove(id);
  }
}
