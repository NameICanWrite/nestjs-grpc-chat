import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VerifyTokenResponse } from 'src/_proto/auth.pb';

export class VerifyTokenResponseDto implements VerifyTokenResponse {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isValid: boolean;
}
