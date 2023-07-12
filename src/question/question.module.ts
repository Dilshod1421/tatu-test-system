import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import { TestGroup } from 'src/test-group/models/test-group.model';
import { JwtModule } from '@nestjs/jwt';
import { AnswerModule } from 'src/answer/answer.module';
import { TestResultModule } from 'src/test-result/test-result.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Question, TestGroup]),
    AnswerModule,
    TestResultModule,
    JwtModule.register({}),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
