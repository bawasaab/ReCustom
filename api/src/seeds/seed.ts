import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { Role } from '../common/enums/role.enum';
import databaseConfig from '../config/database.config';
import * as bcrypt from 'bcrypt';
import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../database/seeders/seeder.module';
import { SeederService } from '../database/seeders/seeder.service';

async function seed() {
  const dbConfig = databaseConfig();
  const connection = await new DataSource({
    type: 'postgres' as const,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [User, ActivityLog],
    synchronize: true,
  }).initialize();

  // Create users
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

  const userRepository = connection.getRepository(User);
  const createdUsers = await userRepository.save(users);

  // Create activity logs
  const activityLogs = createdUsers.map(user => ({
    user,
    action: 'LOGIN',
    description: 'Initial login',
    timestamp: new Date(),
  }));

  const activityLogRepository = connection.getRepository(ActivityLog);
  await activityLogRepository.save(activityLogs);

  console.log('Seeding completed successfully');
  await connection.destroy();
}

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);
  const seeder = app.get(SeederService);
  await seeder.seed();
  await app.close();
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
bootstrap(); 