import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  UseGuards,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginStaffDto } from './dto/login-staff.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { AddSubjectDto } from './dto/addSubject.dto';
import { AddGroupDto } from './dto/addGroup.dto';
import { StaffDto } from './dto/staff.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileStaffDto } from './dto/profile-staff.dto';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { AdminIdDto } from './dto/admin_id.dto';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { UserSelfGuard } from 'src/guards/user-self.guard';

@ApiTags('staffs')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: 'sign up super admin' })
  @Post('signup')
  signup(@Body() staffDto: StaffDto) {
    return this.staffService.signupSuperadmin(staffDto);
  }

  @ApiOperation({ summary: 'create a new staff' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() staffDto: StaffDto) {
    return this.staffService.create(staffDto);
  }

  @ApiOperation({ summary: 'login staff' })
  @Post('login')
  login(
    @Body() loginDto: LoginStaffDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.staffService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'logout staff' })
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.staffService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'add subject to staff' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post('addSubject')
  addSubject(@Body() addSubjectDto: AddSubjectDto) {
    return this.staffService.addSubject(addSubjectDto);
  }

  @ApiOperation({ summary: 'remove subject from staff' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete('removeSubject')
  removeSubject(@Body() addSubjectDto: AddSubjectDto) {
    return this.staffService.removeSubject(addSubjectDto);
  }

  @ApiOperation({ summary: 'add group to staff' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post('addGroup')
  addGroup(@Body() addGroupDto: AddGroupDto) {
    return this.staffService.addGroup(addGroupDto);
  }

  @ApiOperation({ summary: 'remove group from staff' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete('removeGroup')
  removeGroup(@Body() addGroupDto: AddGroupDto) {
    return this.staffService.removeGroup(addGroupDto);
  }

  @ApiOperation({ summary: 'get all staffs' })
  @UseGuards(TeacherGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @ApiOperation({ summary: 'pagination staffs' })
  @UseGuards(TeacherGuard)
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.staffService.paginate(page);
  }

  @ApiOperation({ summary: 'get all staffs no guard' })
  @Get('all')
  getAllStaffs() {
    return this.staffService.getAll();
  }

  @ApiOperation({ summary: 'get staff by name' })
  @UseGuards(TeacherGuard)
  @UseGuards(AuthGuard)
  @Get('fullname')
  findByName(@Body() fullname: string) {
    return this.staffService.findByName(fullname);
  }

  @ApiOperation({ summary: 'get staff by email' })
  @UseGuards(TeacherGuard)
  @UseGuards(AuthGuard)
  @Get('email')
  findByEmail(@Body() email: string) {
    return this.staffService.findByEmail(email);
  }

  @ApiOperation({ summary: 'get staff by id' })
  @UseGuards(TeacherGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.staffService.findById(id);
  }

  @ApiOperation({ summary: 'edit staff profile' })
  @UseGuards(UserSelfGuard)
  @UseGuards(AuthGuard)
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  editProfile(
    @Param('id') id: string,
    @Body() profileStaffDto: ProfileStaffDto,
    @UploadedFile() image: any,
  ) {
    return this.staffService.editProfile(id, profileStaffDto, image);
  }

  @ApiOperation({ summary: 'update staff by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() staffDto: StaffDto) {
    return this.staffService.update(id, staffDto);
  }

  @ApiOperation({ summary: 'delete staff by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body() adminIdDto: AdminIdDto) {
    return this.staffService.remove(id, adminIdDto);
  }
}
