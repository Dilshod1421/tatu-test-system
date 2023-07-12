import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import { QuestionDto } from './dto/question.dto';
import { AnswerService } from 'src/answer/answer.service';
import { TestResultService } from 'src/test-result/test-result.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question) private questionRepository: typeof Question,
    private readonly answerService: AnswerService,
    private readonly testResultService: TestResultService,
  ) {}

  async create(questionDto: QuestionDto): Promise<object> {
    try {
      const question = await this.questionRepository.create(questionDto);
      if (!question) {
        throw new BadRequestException('Savol yaratishda xatolik!');
      }
      return { message: "Savol ro'yxatga qo'shildi", id: question.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Question[]> {
    try {
      const questions = await this.questionRepository.findAll({
        include: { all: true },
      });
      if (!questions.length) {
        throw new BadRequestException("Savollar ro'yxati bo'sh!");
      }
      return questions;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number): Promise<Question> {
    try {
      const question = await this.questionRepository.findByPk(id, {
        include: { all: true },
      });
      if (!question) {
        throw new BadRequestException('Savol topilmadi!');
      }
      return question;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, questionDto: QuestionDto): Promise<object> {
    try {
      const question = await this.questionRepository.findByPk(id, {
        include: { all: true },
      });
      if (!question) {
        throw new BadRequestException('Savol topilmadi!');
      }
      await this.questionRepository.update(questionDto, {
        where: { id },
        returning: true,
      });
      return { message: "Savol o'zgartirildi", question };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const question = await this.questionRepository.findByPk(id);
      if (!question) {
        throw new BadRequestException('Savol topilmadi!');
      }
      await this.answerService.delete(id);
      await this.questionRepository.destroy({ where: { id } });
      return { message: "Savol ro'yxatdan o'chirildi", question };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(test_group: any): Promise<void> {
    try {
      const questions = await this.questionRepository.findAll({
        where: { test_group_id: test_group },
      });
      if (!questions.length) {
        throw new BadRequestException(
          'Ushbu testga tegishli savollar topilmadi!',
        );
      }
      for (let i of questions) {
        await this.answerService.delete(i.id);
        await this.testResultService.delete(i.id);
      }
      await this.questionRepository.destroy({
        where: { test_group_id: test_group },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
