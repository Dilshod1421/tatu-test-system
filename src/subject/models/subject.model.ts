import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Staff } from 'src/staff/models/staff.model';
import { StaffSubject } from './staff-subject.model';
import { TestGroup } from 'src/test-group/models/test-group.model';

interface SubjectAttributes {
  title: string;
}

@Table({ tableName: 'subjects' })
export class Subject extends Model<Subject, SubjectAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @BelongsToMany(() => Staff, () => StaffSubject)
  staffs: Staff[];

  @HasMany(() => TestGroup, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  tests: TestGroup[];
}
