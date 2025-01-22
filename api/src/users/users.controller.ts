import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAllWithLogs();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Get('metrics/all')
  getAllUsersMetrics() {
    return this.usersService.getAllUsersMetrics();
  }

  @Get(':id/metrics')
  getUserMetrics(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserMetrics(id);
  }

  @Get(':id/pdf')
  async getUserPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.usersService.generateUserPdf(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=user-${id}-report.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get(':id/activity-logs')
  getUserActivityLogs(@Param('id') id: string) {
    return this.usersService.getUserActivityLogs(+id);
  }

  @Post(':id/activity')
  async createActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() createActivityDto: CreateActivityDto
  ) {
    return this.usersService.createActivity(id, createActivityDto);
  }
} 