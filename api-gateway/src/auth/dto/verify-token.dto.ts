import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { AuthorizationToken } from 'src/_proto/auth.pb';

export class VerifyTokenDto implements AuthorizationToken {
  @ApiProperty({ minLength: 1, maxLength: 250 })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  token: string;
}
