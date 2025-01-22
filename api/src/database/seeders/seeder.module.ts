import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederService } from './seeder.service';
import { User } from '../../entities/user.entity';
import { ActivityLog } from '../../entities/activity-log.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from '../../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const dbConfig = configService.get('database');
        return {
          type: 'postgres' as const,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [User, ActivityLog],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, ActivityLog])
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {} 