import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuthorizationToken } from 'src/_proto/auth.pb';

export class AuthorizationTokenDto implements AuthorizationToken {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  token: string;
}
