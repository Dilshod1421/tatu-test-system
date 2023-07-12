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
import { TestResultService } from './test-result.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestResultDto } from './dto/test-result.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('test-results')
@Controller('test-result')
export class TestResultController {
  constructor(private readonly testResultService: TestResultService) {}

  @ApiOperation({ summary: 'create a new test result' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() testResultDto: TestResultDto) {
    return this.testResultService.create(testResultDto);
  }

  @ApiOperation({ summary: 'get all test results' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.testResultService.findAll();
  }

  @ApiOperation({ summary: 'get test result by student id' })
  @UseGuards(AuthGuard)
  @Get('studentId/:id')
  findByStudentId(@Param('id') id: string) {
    return this.testResultService.findByStudentId(id);
  }

  @ApiOperation({ summary: 'get test result by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.testResultService.findOne(id);
  }

  @ApiOperation({ summary: 'update test result by id' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() testResultDto: TestResultDto) {
    return this.testResultService.update(id, testResultDto);
  }

  @ApiOperation({ summary: 'delete test result by id' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.testResultService.remove(id);
  }
}
