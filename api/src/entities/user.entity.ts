import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ActivityLog } from './activity-log.entity';
import { Role } from '../common/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role;

  @OneToMany(() => ActivityLog, activityLog => activityLog.user, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  activityLogs: ActivityLog[];
} 