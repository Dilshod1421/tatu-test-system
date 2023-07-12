import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/group/models/group.model';
import { TestResult } from 'src/test-result/models/test-result.model';
import { TestSubmit } from 'src/test-submit/models/test-submit.model';
import { TestTime } from 'src/test-time/models/test-time.model';

interface StudentsAttributes {
  id: string;
  login: string;
  hashed_password: string;
  is_active: boolean;
  full_name: string;
  phone_number: string;
  email: string;
  telegram_username: string;
  image: string;
  group_id: number;
}

@Table({ tableName: 'student' })
export class Student extends Model<Student, StudentsAttributes> {
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
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

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

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
  })
  group_id: number;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => TestResult)
  test_results: TestResult[];

  @HasMany(() => TestSubmit)
  test_submits: TestSubmit[];

  @HasMany(() => TestTime)
  test_times: TestTime[];
}
