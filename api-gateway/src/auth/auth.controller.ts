import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthorizationToken, VerifyTokenResponse,
} from '../_proto/auth.pb';
import { AuthSignInDto } from './dto/auth-singin.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { AuthService } from './auth.service';
import { RpcExceptionFilter } from '../utils/filters/grpc-exception.filter';
import { AuthGuard } from './auth.guard';
import { AuthorizationTokenDto } from './dto/authorization-token.dto';
import { VerifyTokenResponseDto } from './dto/verify-token-response.dto';
import { AuthSignUpDto } from './dto/auth-signup.dto';

@ApiTags('auth')
@Controller('auth')
@UseFilters(RpcExceptionFilter)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('/signIn')
  @ApiBody({
    type: AuthSignInDto,
  })
  @ApiResponse({
    type: AuthorizationTokenDto,
    status: 201,
  })
  async signIn(
    @Body() authSignInDto: AuthSignInDto,
  ): Promise<AuthorizationToken> {
    this.logger.debug(`authSignInDto: ${JSON.stringify(authSignInDto)}`);

    return this.authService.signIn(authSignInDto);
  }

  @Post('/signUp')
  @ApiBody({
    type: AuthSignUpDto,
  })
  @ApiResponse({
    type: AuthorizationTokenDto,
    status: 201,
  })
  async signUp(
    @Body() authSignUpDto: AuthSignUpDto,
  ): Promise<AuthorizationToken> {
    this.logger.debug(`authSignInDto: ${JSON.stringify(authSignUpDto)}`);

    return this.authService.signUp(authSignUpDto);
  }

  @Post('/verify-token')
  @ApiOperation({
    security: [],
  })
  @ApiBody({
    type: VerifyTokenDto,
  })
  @ApiResponse({
    type: VerifyTokenResponseDto,
    status: 201,
  })
  async verifyToken(@Body() authVerifyDto: VerifyTokenDto): Promise<VerifyTokenResponse> {
    const { token } = authVerifyDto;

    this.logger.debug(`token: ${token}`);

    return this.authService.verifyToken({ token });
  }

}
