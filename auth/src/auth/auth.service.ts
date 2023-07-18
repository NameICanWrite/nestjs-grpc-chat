import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  AuthorizationToken,
  SignInRequest,
  VerifyTokenResponse,
} from '../_proto/auth.pb';
import { CreateUserRequest, UserServiceClient, USER_SERVICE_NAME } from 'src/_proto/user.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private userServiceClient: UserServiceClient

  @Inject(USER_SERVICE_NAME)
  private readonly grpcUserClient: ClientGrpc

  public onModuleInit(): void {
    this.userServiceClient = this.grpcUserClient.getService<UserServiceClient>(
      USER_SERVICE_NAME
    )
  }

  private readonly logger: Logger = new Logger(AuthService.name, {
    timestamp: true,
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private getClientId(environment: string): string {
    return (
      this.configService.get<string>(`crm.clientId.${environment}`) ||
      this.configService.get<string>('crm.clientId.prod')
    );
  }

  private getClientSecret(environment: string): string {
    return (
      this.configService.get<string>(`crm.clientSecret.${environment}`) ||
      this.configService.get<string>('crm.clientSecret.prod')
    );
  }

  async signIn(signInRequest: SignInRequest): Promise<AuthorizationToken> {
    const {login, password} = signInRequest
    const {isValid, userId} = await firstValueFrom(this.userServiceClient.verifyPassword({userName: login, password}))

    if (!isValid && userId) {
      throw new UnauthorizedException('AuthService::SignIn Password incorrect')
    }
    if (!isValid && !userId) {
      throw new UnauthorizedException('AuthService::SignIn User doesnt exist')
    }

    return {
      token: this.jwtService.sign({ userId }),
    }
  }

  async signUp(createUserRequest: CreateUserRequest): Promise<AuthorizationToken> {
    const user = await firstValueFrom(this.userServiceClient.createUser(createUserRequest))

    return {
      token: this.jwtService.sign({ userId: user.id }),
    }
  }

  async verifyToken({ token }: AuthorizationToken): Promise<VerifyTokenResponse> {
    this.logger.debug(`verifyToken::token: ${token}`);
    try {
      await this.jwtService.verifyAsync(token);
      return {isValid: true};
    } catch {
      return {isValid: false};
    }
  }
}
