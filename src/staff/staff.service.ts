import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { hash, compare } from 'bcrypt';
import { Staff } from './models/staff.model';
import { FilesService } from 'src/files/files.service';
import { LoginStaffDto } from './dto/login-staff.dto';
import { generateToken, writeToCookie } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { SubjectService } from 'src/subject/subject.service';
import { GroupService } from 'src/group/group.service';
import { AddSubjectDto } from './dto/addSubject.dto';
import { AddGroupDto } from './dto/addGroup.dto';
import { StaffDto } from './dto/staff.dto';
import { ProfileStaffDto } from './dto/profile-staff.dto';
import { Op } from 'sequelize';
import { AdminIdDto } from './dto/admin_id.dto';
import { Student } from 'src/student/models/student.model';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff) private staffRepository: typeof Staff,
    @InjectModel(Student) private studentRepository: typeof Student,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
    private readonly subjectService: SubjectService,
    private readonly groupService: GroupService,
  ) {}

  async signupSuperadmin(staffDto: StaffDto): Promise<object> {
    try {
      let hashed_password: string;
      const staffs = await this.staffRepository.findAll();
      if (!staffs.length) {
        try {
          hashed_password = await hash(staffDto.password, 7);
        } catch (error) {
          throw new BadRequestException(error.message);
        }
        const staff = await this.staffRepository.create({
          hashed_password,
          ...staffDto,
        });
        if (!staff) {
          throw new BadRequestException('Super adminni yaratishda xatolik!');
        }
        return {
          message: "Super admin sifatida ro'yxatdan o'tdingiz",
        };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(staffDto: StaffDto): Promise<object> {
    try {
      let hashed_password: string;
      try {
        hashed_password = await hash(staffDto.password, 7);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      const exist_student_login = await this.studentRepository.findOne({
        where: { login: staffDto.login },
      });
      const exist_login = await this.staffRepository.findOne({
        where: { login: staffDto.login },
      });
      if (exist_login || exist_student_login) {
        throw new BadRequestException('Bunady login mavjud!');
      }
      const exist_phone = await this.staffRepository.findOne({
        where: { phone_number: staffDto.phone_number },
      });
      if (exist_phone) {
        throw new BadRequestException('Bunday telefon raqam mavjud!');
      }
      const staff = await this.staffRepository.create({
        hashed_password,
        ...staffDto,
      });
      if (!staff) {
        throw new BadRequestException('Xodimni yaratishda xatolik!');
      }
      return { message: "Xodim ro'yxatga qo'shildi", role: staff.role };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginStaffDto, res: Response): Promise<object> {
    const { login, password } = loginDto;
    try {
      const staff = await this.staffRepository.findOne({
        where: { login },
        include: { all: true },
      });
      if (!staff) {
        throw new BadRequestException('Login mos kelmadi!');
      }
      let is_match_pass: boolean;
      try {
        is_match_pass = await compare(password, staff.hashed_password);
        if (!is_match_pass) {
          throw new BadRequestException('Parol mos kelmadi!');
        }
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      const jwt_payload = {
        id: staff.id,
        role: staff.role,
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
        id: staff.id,
        role: staff.role,
        access_token: token.access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout(refresh_token: string, res: Response): Promise<object> {
    try {
      try {
        await this.jwtService.verify(refresh_token, {
          secret: process.env.REFRESH_TOKEN_KEY,
        });
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      res.clearCookie('refresh_token');
      return { message: 'Tizimdan chiqildi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addSubject(addSubjectDto: AddSubjectDto): Promise<object> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { id: addSubjectDto.staff_id },
      });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      const subject = await this.subjectService.findByTitle(
        addSubjectDto.title,
      );
      if (!subject) {
        throw new BadRequestException('Fan topilmadi!');
      }
      await staff.$add('subjects', subject.id);
      return { message: 'Fan xodimga biriktirildi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeSubject(addSubjectdto: AddSubjectDto): Promise<object> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { id: addSubjectdto.staff_id },
      });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      const subject = await this.subjectService.findByTitle(
        addSubjectdto.title,
      );
      if (!subject) {
        throw new BadRequestException('Fan topilmadi!');
      }
      await staff.$remove('subjects', subject.id);
      return { message: 'Fan xodimdan olib tashlandi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addGroup(addGroupDto: AddGroupDto): Promise<object> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { id: addGroupDto.staff_id },
      });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      const group = await this.groupService.findByName(addGroupDto.name);
      if (!group) {
        throw new BadRequestException('Guruh topilmadi!');
      }
      await staff.$add('groups', group.id);
      return { message: 'Guruh xodimga biriktirildi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeGroup(addGroupDto: AddGroupDto): Promise<object> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { id: addGroupDto.staff_id },
      });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      const group = await this.groupService.findByName(addGroupDto.name);
      if (!group) {
        throw new BadRequestException('Guruh topilmadi!');
      }
      await staff.$remove('groups', group.id);
      return { message: 'Guruh xodimdan olib tashlandi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Staff[]> {
    try {
      const staffs = await this.staffRepository.findAll({
        include: { all: true },
      });
      if (!staffs.length) {
        throw new BadRequestException("Xodimlar ro'yxati bo'sh!");
      }
      return staffs;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<Staff> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      return staff;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByLogin(login: string): Promise<void> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { login },
        include: { all: true },
      });
      if (staff) {
        throw new BadRequestException('Bunday login mavjud!');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByName(full_name: string): Promise<Staff> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { full_name: { [Op.like]: `%${full_name}%` } },
        include: { all: true },
      });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      return staff;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByEmail(email: string): Promise<Staff> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { email },
        include: { all: true },
      });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      return staff;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getAll(): Promise<boolean> {
    try {
      const staffs = await this.staffRepository.findAll();
      if (!staffs.length) {
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, staffDto: StaffDto): Promise<object> {
    try {
      const { login, phone_number } = staffDto;
      const staff = await this.staffRepository.findOne({ where: { id } });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      if (login) {
        const exist_login = await this.staffRepository.findOne({
          where: { login },
        });
        if (exist_login) {
          if (staff.id != exist_login.id) {
            throw new BadRequestException('Bu login band!');
          }
        }
      }
      if (phone_number) {
        const exist_phone = await this.staffRepository.findOne({
          where: { phone_number },
        });
        if (exist_phone) {
          if (staff.id != exist_phone.id) {
            throw new BadRequestException('Bu login band!');
          }
        }
      }
      let hashed_password: string;
      if (staffDto.password == staff.hashed_password) {
        hashed_password = staff.hashed_password;
      } else {
        try {
          hashed_password = await hash(staffDto.password, 7);
        } catch (error) {
          throw new BadRequestException(error.message);
        }
      }
      const updated_staff = await this.staffRepository.update(
        { ...staffDto, hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: "Xodim ma'lumotlari tahrirlandi",
        staff: updated_staff[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async editProfile(
    id: string,
    profileStaffDto: ProfileStaffDto,
    image: any,
  ): Promise<object> {
    const { phone_number, email, telegram_username } = profileStaffDto;
    const staff = await this.staffRepository.findOne({ where: { id } });
    if (!staff) {
      throw new BadRequestException('Xodim topilmadi!');
    }
    if (phone_number) {
      const exist_phone = await this.staffRepository.findOne({
        where: { phone_number },
      });
      if (exist_phone) {
        if (exist_phone.id != staff.id) {
          throw new BadRequestException('Bu telefon raqam band!');
        }
      }
    }
    if (email) {
      const exist_email = await this.staffRepository.findOne({
        where: { email },
      });
      if (exist_email) {
        if (exist_email.id != staff.id) {
          throw new BadRequestException('Bu email band!');
        }
      }
    }
    if (telegram_username) {
      const exist_telegram = await this.staffRepository.findOne({
        where: { telegram_username },
      });
      if (exist_telegram) {
        if (exist_telegram.id != staff.id) {
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
      const staff_updated = await this.staffRepository.update(
        { image: image_name, ...profileStaffDto },
        { where: { id: staff.id }, returning: true },
      );
      return {
        message: "Ma'lumotlaringiz tahrirlandi",
        staff: staff_updated[1][0],
      };
    }
    const updated_staff = await this.staffRepository.update(profileStaffDto, {
      where: { id: staff.id },
      returning: true,
    });
    return {
      message: "Ma'lumotlaringiz tahrirlandi",
      staff: updated_staff[1][0],
    };
  }

  async remove(id: string, adminIdDto: AdminIdDto): Promise<object> {
    try {
      const staff = await this.staffRepository.findOne({ where: { id } });
      if (!staff) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      if (staff.role === 'superadmin') {
        throw new BadRequestException("Super adminni o'chirish mumkin emas!");
      }
      const admin = await this.staffRepository.findOne({
        where: { id: adminIdDto.admin_id },
      });
      if (!admin) {
        throw new BadRequestException('Xodim topilmadi!');
      }
      if (admin.role === 'admin' && staff.role === 'admin') {
        throw new BadRequestException("Adminni o'chirish mumkin emas!");
      }
      await this.staffRepository.destroy({ where: { id } });
      return { message: "Xodim ro'yxatdan o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
