import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { SignInRequest } from '../../_proto/auth.pb';
import { EnvironmentEnum } from '../auth.enum';

export class AuthSignInDto implements SignInRequest {
  @ApiProperty({ minLength: 1, maxLength: 250 })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string
}
