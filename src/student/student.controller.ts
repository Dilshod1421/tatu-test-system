import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { StudentDto } from './dto/student.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { StudentProfileDto } from './dto/student-profile.dto';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { UserSelfGuard } from 'src/guards/user-self.guard';

@ApiTags('students')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'create a new student' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() studentDto: StudentDto) {
    return this.studentService.create(studentDto);
  }

  @ApiOperation({ summary: 'login of student' })
  @Post('login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.studentService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'logout of student' })
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.studentService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'get all students' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @ApiOperation({ summary: 'get student by email' })
  @UseGuards(AuthGuard)
  @Get('email')
  findByEmail(@Body() email: string) {
    return this.studentService.findByEmail(email);
  }

  @ApiOperation({ summary: 'get student by first name' })
  @UseGuards(AuthGuard)
  @Get('fullname')
  findByName(@Body() full_name: string) {
    return this.studentService.findByName(full_name);
  }

  @ApiOperation({ summary: 'get student by id' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.studentService.findById(id);
  }

  @ApiOperation({ summary: 'edit student profile by id' })
  @UseGuards(UserSelfGuard)
  @UseGuards(AuthGuard)
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  editProfile(
    @Param('id') id: string,
    @Body() studentProfileDto: StudentProfileDto,
    @UploadedFile() image: any,
  ) {
    return this.studentService.editProfile(id, studentProfileDto, image);
  }

  @ApiOperation({ summary: 'update student by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() studentDto: StudentDto) {
    return this.studentService.update(id, studentDto);
  }

  @ApiOperation({ summary: 'delete student by id' })
  @UseGuards(IsAdminGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
