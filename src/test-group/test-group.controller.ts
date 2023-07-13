import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TestGroupService } from './test-group.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestGroupDto } from './dto/test-group.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin.guard';

@ApiTags('test-groups')
@Controller('test-group')
export class TestGroupController {
  constructor(private readonly testGroupService: TestGroupService) {}

  @ApiOperation({ summary: 'create a new test group' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() testGroupDto: TestGroupDto) {
    return this.testGroupService.create(testGroupDto);
  }

  @ApiOperation({ summary: 'get all test groups' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.testGroupService.findAll();
  }

  @ApiOperation({ summary: 'get all test groups' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.testGroupService.paginate(page);
  }

  @ApiOperation({ summary: 'get test group by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.testGroupService.findOne(id);
  }

  @ApiOperation({ summary: 'update test group by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() testGroupDto: TestGroupDto) {
    return this.testGroupService.update(id, testGroupDto);
  }

  @ApiOperation({ summary: 'delete test group by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.testGroupService.remove(id);
  }
}
