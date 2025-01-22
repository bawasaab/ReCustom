import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { PdfGeneratorService } from './services/pdf-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ActivityLog])
  ],
  controllers: [UsersController],
  providers: [UsersService, PdfGeneratorService],
  exports: [UsersService]
})
export class UsersModule {} 