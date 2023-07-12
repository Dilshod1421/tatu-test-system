import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { StaffModule } from './staff/staff.module';
import { FilesModule } from './files/files.module';
import { SubjectModule } from './subject/subject.module';
import { GroupModule } from './group/group.module';
import { StudentModule } from './student/student.module';
import { QuestionModule } from './question/question.module';
import { TestGroupModule } from './test-group/test-group.module';
import { AnswerModule } from './answer/answer.module';
import { TestResultModule } from './test-result/test-result.module';
import { TestTimeModule } from './test-time/test-time.module';
import { TestSubmitModule } from './test-submit/test-submit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB,
      models: [],
      autoLoadModels: true,
      logging: true,
    }),
    StaffModule,
    FilesModule,
    SubjectModule,
    GroupModule,
    StudentModule,
    QuestionModule,
    TestGroupModule,
    AnswerModule,
    TestResultModule,
    TestTimeModule,
    TestSubmitModule,
  ],
})
export class AppModule {}
