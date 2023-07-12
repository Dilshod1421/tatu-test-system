import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Staff } from 'src/staff/models/staff.model';
import { Subject } from './subject.model';

@Table({ tableName: 'staff-subject', createdAt: false, updatedAt: false })
export class StaffSubject extends Model<StaffSubject> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Staff)
  @Column({
    type: DataType.UUID,
  })
  staff_id: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
  })
  subject_id: number;
}
