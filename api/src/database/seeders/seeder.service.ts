import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { ActivityLog } from '../../entities/activity-log.entity';
import { Role } from '../../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedActivityLogs();
  }

  private async seedUsers() {
    const users = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: Role.ADMIN,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: Role.USER,
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (!existingUser) {
        await this.userRepository.save(userData);
      }
    }
  }

  private async seedActivityLogs() {
    const users = await this.userRepository.find();
    const activities = users.map(user => ({
      user,
      action: 'LOGIN',
      description: 'Initial login',
      timestamp: new Date(),
    }));

    await this.activityLogRepository.save(activities);
  }
} 