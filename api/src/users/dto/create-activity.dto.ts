import { IsString, IsNotEmpty } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  description: string;
} 