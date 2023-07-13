import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from './models/student.model';
import { FilesService } from 'src/files/files.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { Response } from 'express';
import { generateToken, writeToCookie } from 'src/utils/token';
import { LoginDto } from './dto/login.dto';
import { StudentDto } from './dto/student.dto';
import { Op } from 'sequelize';
import { StudentProfileDto } from './dto/student-profile.dto';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student) private studentRepository: typeof Student,
    private readonly fileService: FilesService,
    private readonly jwtService: JwtService,
    private readonly staffService: StaffService,
  ) {}

  async create(studentDto: StudentDto): Promise<object> {
    try {
      let hashed_password: string;
      try {
        hashed_password = await hash(studentDto.password, 7);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      await this.staffService.findByLogin(studentDto.login);
      const exist_login = await this.studentRepository.findOne({
        where: { login: studentDto.login },
      });
      if (exist_login) {
        throw new BadRequestException('Bunday login mavjud!');
      }
      const exist_phone = await this.studentRepository.findOne({
        where: { phone_number: studentDto.phone_number },
      });
      if (exist_phone) {
        throw new BadRequestException('Bunday telefon raqam mavjud!');
      }
      const student = await this.studentRepository.create({
        hashed_password,
        ...studentDto,
      });
      return {
        message: "Talaba ro'yxatga qo'shildi",
        student_id: student.id,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto, res: Response): Promise<object> {
    try {
      const { login, password } = loginDto;
      const student = await this.studentRepository.findOne({
        where: { login },
      });
      if (!student) {
        throw new BadRequestException('Login mos kelmadi!');
      }
      let is_match_pass: boolean;
      try {
        is_match_pass = await compare(password, student.hashed_password);
        if (!is_match_pass) {
          throw new BadRequestException('Parol mos kelmadi!');
        }
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      const jwt_payload = {
        id: student.id,
        is_active: student.is_active,
      };
      let token: any;
      try {
        token = await generateToken(jwt_payload, this.jwtService);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      try {
        await writeToCookie(token.refresh_token, res);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      return {
        message: 'Tizimga kirildi',
        id: student.id,
        is_active: student.is_active,
        access_token: token.access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout(refresh_token: string, res: Response): Promise<object> {
    try {
      let check: any;
      try {
        check = await this.jwtService.verify(refresh_token, {
          secret: process.env.REFRESH_TOKEN_KEY,
        });
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      res.clearCookie(refresh_token);
      return { message: 'Tizimdan chiqildi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      const students = await this.studentRepository.findAll({
        include: { all: true },
      });
      if (!students.length) {
        throw new BadRequestException("Talabalar ro'yxati bo'sh!");
      }
      return students;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!student) {
        throw new BadRequestException('Talaba topilmadi!');
      }
      return student;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByLogin(login: string): Promise<void> {
    try {
      const student = await this.studentRepository.findOne({
        where: { login },
        include: { all: true },
      });
      if (student) {
        throw new BadRequestException('Bunday login mavjud!');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({
        where: { email },
        include: { all: true },
      });
      if (!student) {
        throw new BadRequestException('Talaba topilmadi!');
      }
      return student;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByName(full_name: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({
        where: { full_name: { [Op.like]: `%${full_name}%` } },
        include: { all: true },
      });
      if (!student) {
        throw new BadRequestException('Talaba topilmadi!');
      }
      return student;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, studentDto: StudentDto): Promise<object> {
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new BadRequestException('Talaba topilmadi!');
      }
      const exist_login = await this.studentRepository.findOne({
        where: { login: studentDto.login },
      });
      if (exist_login) {
        if (student.id != exist_login.id) {
          throw new BadRequestException('Bunday login mavjud!');
        }
      }
      const exist_phone = await this.studentRepository.findOne({
        where: { phone_number: studentDto.phone_number },
      });
      if (exist_phone) {
        if (exist_phone.id != student.id) {
          throw new BadRequestException('Bunday telefon raqam mavjud!');
        }
      }
      await this.studentRepository.update(studentDto, {
        where: { id: student.id },
        returning: true,
      });
      return { message: "Talaba ma'lumotlari tahirilandi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async editProfile(
    id: string,
    studentProfileDto: StudentProfileDto,
    image: any,
  ) {
    try {
      const { phone_number, email, telegram_username } = studentProfileDto;
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new BadRequestException('Talaba topilmadi!');
      }
      if (phone_number) {
        const exist_phone = await this.studentRepository.findOne({
          where: { phone_number },
        });
        if (exist_phone) {
          if (exist_phone.id != student.id) {
            throw new BadRequestException('Bu telefon raqam band!');
          }
        }
      }
      if (email) {
        const exist_email = await this.studentRepository.findOne({
          where: { email },
        });
        if (exist_email) {
          if (exist_email.id != student.id) {
            throw new BadRequestException('Bu email band!');
          }
        }
      }
      if (telegram_username) {
        const exist_telegram = await this.studentRepository.findOne({
          where: { telegram_username },
        });
        if (exist_telegram) {
          if (exist_telegram.id != student.id) {
            throw new BadRequestException('Bu telegram username band!');
          }
        }
      }
      if (image) {
        let image_name: string;
        try {
          image_name = await this.fileService.createFile(image);
        } catch (error) {
          throw new BadRequestException(error.message);
        }
        await this.studentRepository.update(
          { image: image_name, ...studentProfileDto },
          { where: { id }, returning: true },
        );
        return { message: "Ma'lumotlaringiz tahrirlandi!" };
      }
      await this.studentRepository.update(studentProfileDto, {
        where: { id: student.id },
        returning: true,
      });
      return { message: "Ma'lumotlaringiz tahrirlandi!" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<object> {
    try {
      const student = await this.findById(id);
      student.destroy();
      return { message: "Talaba ro'yxatdan o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
