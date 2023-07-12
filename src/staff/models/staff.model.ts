import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/group/models/group.model';
import { StaffGroup } from 'src/group/models/staff-group.model';
import { StaffSubject } from 'src/subject/models/staff-subject.model';
import { Subject } from 'src/subject/models/subject.model';

interface StaffAttributes {
  id: string;
  login: string;
  hashed_password: string;
  role: string;
  full_name: string;
  phone_number: string;
  email: string;
  telegram_username: string;
  image: string;
}

@Table({ tableName: 'staff' })
export class Staff extends Model<Staff, StaffAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  telegram_username: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @BelongsToMany(() => Subject, () => StaffSubject)
  subjects: Subject[];

  @BelongsToMany(() => Group, () => StaffGroup)
  groups: Group[];
}
