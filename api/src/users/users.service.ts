import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMetricsDto } from './dto/user-metrics.dto';
import PDFDocument = require('pdfkit');
import { PdfGeneratorService } from './services/pdf-generator.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    private pdfGeneratorService: PdfGeneratorService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['activityLogs']
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }

  async getUserMetrics(userId: number): Promise<UserMetricsDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['activityLogs'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const activityBreakdown = user.activityLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const lastActivity = user.activityLogs.length > 0
      ? user.activityLogs.reduce((latest, current) => 
          latest.timestamp > current.timestamp ? latest : current
        ).timestamp
      : null;

    return {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      totalActivities: user.activityLogs.length,
      lastActivityDate: lastActivity,
      activityBreakdown,
    };
  }

  async getAllUsersMetrics(): Promise<UserMetricsDto[]> {
    const users = await this.usersRepository.find({
      relations: ['activityLogs'],
    });

    return users.map(user => {
      const activityBreakdown = user.activityLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const lastActivity = user.activityLogs.length > 0
        ? user.activityLogs.reduce((latest, current) => 
            latest.timestamp > current.timestamp ? latest : current
          ).timestamp
        : null;

      return {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        totalActivities: user.activityLogs.length,
        lastActivityDate: lastActivity,
        activityBreakdown,
      };
    });
  }

  async generateUserPdf(userId: number): Promise<Buffer> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['activityLogs'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const metrics = await this.getUserMetrics(userId);
    const recentActivities = user.activityLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    // Log the download activity
    await this.activityLogRepository.save({
      user,
      action: 'DOWNLOAD_PDF',
      description: 'User report downloaded',
      timestamp: new Date(),
    });

    // Create PDF
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    // Collect PDF chunks
    doc.on('data', (chunk) => chunks.push(chunk));
    
    // Generate PDF content
    await this.pdfGeneratorService.generateUserReport(doc, user, metrics, recentActivities);
    
    // Return promise that resolves with complete PDF buffer
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);
      doc.end();
    });
  }

  async findAllWithLogs() {
    return this.usersRepository.find({
      relations: ['activityLogs'],
      order: {
        id: 'DESC',
      },
    });
  }

  async getUserActivityLogs(userId: number) {
    return this.activityLogRepository.find({
      where: { user: { id: userId } },
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async createActivity(userId: number, createActivityDto: CreateActivityDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const activity = await this.activityLogRepository.save({
      user,
      action: createActivityDto.action,
      description: createActivityDto.description,
      timestamp: new Date(),
    });

    return activity;
  }
} 