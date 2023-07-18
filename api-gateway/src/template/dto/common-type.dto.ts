import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommonTypeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  created_at: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  updated_at: string | null;
}
