import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Staff } from './models/staff.model';
import { FilesModule } from 'src/files/files.module';
import { Subject } from 'src/subject/models/subject.model';
import { JwtModule } from '@nestjs/jwt';
import { Group } from 'src/group/models/group.model';
import { StaffGroup } from 'src/group/models/staff-group.model';
import { SubjectModule } from 'src/subject/subject.module';
import { GroupModule } from 'src/group/group.module';
import { StaffSubject } from 'src/subject/models/staff-subject.model';
import { Student } from 'src/student/models/student.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Staff,
      Subject,
      StaffSubject,
      Group,
      StaffGroup,
      Student,
    ]),
    FilesModule,
    SubjectModule,
    GroupModule,
    JwtModule.register({}),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
