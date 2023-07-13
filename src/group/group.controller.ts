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
import { GroupService } from './group.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupDto } from './dto/group.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin.guard';

@ApiTags('groups')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'create a new group' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() groupDto: GroupDto) {
    return this.groupService.create(groupDto);
  }

  @ApiOperation({ summary: 'get all groups' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @ApiOperation({ summary: 'pagination groups' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.groupService.paginate(page);
  }

  @ApiOperation({ summary: 'get group by name' })
  @UseGuards(AuthGuard)
  @Get('name')
  findByName(@Body() name: string) {
    return this.groupService.findByName(name);
  }

  @ApiOperation({ summary: 'get group by start date' })
  @UseGuards(AuthGuard)
  @Get('startdate')
  findByStartDate(@Body() start_date: Date) {
    return this.groupService.findByStartDate(start_date);
  }

  @ApiOperation({ summary: 'get group by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.groupService.findById(id);
  }

  @ApiOperation({ summary: 'udpate group by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() groupDto: GroupDto) {
    return this.groupService.update(id, groupDto);
  }

  @ApiOperation({ summary: 'delete group by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupService.remove(id);
  }
}
