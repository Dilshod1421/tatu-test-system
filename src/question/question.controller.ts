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
import { QuestionService } from './question.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionDto } from './dto/question.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin.guard';

@ApiTags('questions')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: 'create a new question' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() questionDto: QuestionDto) {
    return this.questionService.create(questionDto);
  }

  @ApiOperation({ summary: 'get all questions' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @ApiOperation({ summary: 'get question by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.questionService.findOne(id);
  }

  @ApiOperation({ summary: 'update question by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() questionDto: QuestionDto) {
    return this.questionService.update(id, questionDto);
  }

  @ApiOperation({ summary: 'delete question by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.questionService.remove(id);
  }
}
