import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Staff } from 'src/staff/models/staff.model';
import { Group } from './group.model';

@Table({ tableName: 'staff-group' })
export class StaffGroup extends Model<StaffGroup> {
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

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
  })
  group_id: number; 
}
