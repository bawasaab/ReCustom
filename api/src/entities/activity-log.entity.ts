import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  description: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => User, user => user.activityLogs, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  user: User;
} 