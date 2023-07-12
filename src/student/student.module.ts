import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/group/models/group.model';
import { Student } from './models/student.model';
import { FilesModule } from 'src/files/files.module';
import { JwtModule } from '@nestjs/jwt';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Student, Group]),
    FilesModule,
    StaffModule,
    JwtModule.register({}),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
