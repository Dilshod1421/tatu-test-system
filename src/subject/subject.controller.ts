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
import { SubjectService } from './subject.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubjectDto } from './dto/subject.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin.guard';

@ApiTags('subjects')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ summary: 'create a new subject' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() subjectDto: SubjectDto) {
    return this.subjectService.create(subjectDto);
  }

  @ApiOperation({ summary: 'get all subjects' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @ApiOperation({ summary: 'get subject by title' })
  @UseGuards(AuthGuard)
  @Get('title')
  findByTitle(@Body() title: string) {
    return this.subjectService.findByTitle(title);
  }

  @ApiOperation({ summary: 'get subject by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.subjectService.findById(id);
  }

  @ApiOperation({ summary: 'update subject by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() subjectDto: SubjectDto) {
    return this.subjectService.update(id, subjectDto);
  }

  @ApiOperation({ summary: 'delete subject by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.subjectService.remove(id);
  }
}
