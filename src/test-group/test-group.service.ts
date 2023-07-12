import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestGroup } from './models/test-group.model';
import { TestGroupDto } from './dto/test-group.dto';
import { Answer } from 'src/answer/models/answer.model';
import { Question } from 'src/question/models/question.model';
import { Subject } from 'src/subject/models/subject.model';
import { QuestionService } from 'src/question/question.service';
import { TestSubmitService } from 'src/test-submit/test-submit.service';
import { TestTimeService } from 'src/test-time/test-time.service';

@Injectable()
export class TestGroupService {
  constructor(
    @InjectModel(TestGroup) private testGroupRepository: typeof TestGroup,
    private readonly questionService: QuestionService,
    private readonly testSubmitService: TestSubmitService,
    private readonly testTimeService: TestTimeService,
  ) {}

  async create(testGroupDto: TestGroupDto): Promise<object> {
    try {
      const test_group = await this.testGroupRepository.create(testGroupDto);
      if (!test_group) {
        throw new BadRequestException('Test yaratishda xatolik!');
      }
      return { message: "Test ro'yxatga qo'shildi", id: test_group.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<TestGroup[]> {
    try {
      const test_groups = await this.testGroupRepository.findAll({
        include: [{ model: Subject }, { model: Question, include: [Answer] }],
      });
      if (!test_groups.length) {
        throw new BadRequestException("Testlar ro'yxati bo'sh!");
      }
      return test_groups;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number): Promise<TestGroup> {
    try {
      const test_group = await this.testGroupRepository.findByPk(id, {
        include: [{ model: Subject }, { model: Question, include: [Answer] }],
      });
      if (!test_group) {
        throw new BadRequestException('Test topilmadi!');
      }
      return test_group;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, testGroupDto: TestGroupDto): Promise<object> {
    try {
      const test_group = await this.testGroupRepository.findByPk(id);
      if (!test_group) {
        throw new BadRequestException('Test topilmadi!');
      }
      await this.testGroupRepository.update(testGroupDto, {
        where: { id: test_group.id },
        returning: true,
      });
      return { message: 'Test tahrirlandi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const test_group = await this.testGroupRepository.findByPk(id);
      if (!test_group) {
        throw new BadRequestException('Test topilmadi!');
      }
      await this.questionService.delete(id);
      await this.testSubmitService.delete(id);
      await this.testTimeService.delete(id);
      await this.testGroupRepository.destroy({ where: { id } });
      return { message: "Test ro'yxatdan o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(subject_id: number): Promise<void> {
    try {
      const test_groups = await this.testGroupRepository.findAll({
        where: { subject_id },
      });
      if (!test_groups.length) {
        throw new BadRequestException('Test topilmadi!');
      }
      await this.questionService.delete(test_groups);
      await this.testSubmitService.delete(test_groups);
      await this.testTimeService.delete(test_groups);
      await this.testGroupRepository.destroy({ where: { subject_id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
