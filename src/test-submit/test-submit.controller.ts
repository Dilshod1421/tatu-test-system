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
import { TestSubmitService } from './test-submit.service';
import { TestSubmitDto } from './dto/test-submit.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('test-submits')
@Controller('test-submit')
export class TestSubmitController {
  constructor(private readonly testSubmitService: TestSubmitService) {}

  @ApiOperation({ summary: 'create a new test submit' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() testSubmitDto: TestSubmitDto) {
    return this.testSubmitService.create(testSubmitDto);
  }

  @ApiOperation({ summary: 'get all test submits' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.testSubmitService.findAll();
  }

  @ApiOperation({ summary: 'get test submits by student and test-goup id' })
  @UseGuards(AuthGuard)
  @Get('find/:id1/:id2')
  findById(@Param('id1') id1: string, @Param('id2') id2: number) {
    return this.testSubmitService.findById(id1, id2);
  }

  @ApiOperation({ summary: 'get test submit by id' })
  @UseGuards(AuthGuard)
  @Get('student/:id')
  findByStudentId(@Param('id') id: string) {
    return this.testSubmitService.findByStudentId(id);
  }

  @ApiOperation({ summary: 'get test submit by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.testSubmitService.findOne(id);
  }

  @ApiOperation({ summary: 'update test submit' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() testSubmitDto: TestSubmitDto) {
    return this.testSubmitService.update(id, testSubmitDto);
  }

  @ApiOperation({ summary: 'delete test submit' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.testSubmitService.remove(id);
  }
}
