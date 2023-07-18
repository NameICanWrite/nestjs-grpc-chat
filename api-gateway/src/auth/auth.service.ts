import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserRequest } from '../_proto/user.pb';
import {
  AUTHORIZATION_SERVICE_NAME,
  AuthorizationClient,
  AuthorizationToken,
  SignInRequest,
  VerifyTokenResponse,
} from '../_proto/auth.pb';

@Injectable()
export class AuthService implements OnModuleInit {
  private svc: AuthorizationClient;

  @Inject(AUTHORIZATION_SERVICE_NAME)
  private readonly grpcAuthClient: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.grpcAuthClient.getService<AuthorizationClient>(
      AUTHORIZATION_SERVICE_NAME,
    );
  }

  public signUp(signUpRequest: CreateUserRequest) {
    try {
      return firstValueFrom(this.svc.signUp(signUpRequest));
    } catch (err) {
      console.log(err)
    }
    // return firstValueFrom(this.svc.signUp(signUpRequest));
  }

  public signIn(signInRequest: SignInRequest): Promise<AuthorizationToken> {
    return firstValueFrom(this.svc.signIn(signInRequest));
  }

  public verifyToken(request: AuthorizationToken): Promise<VerifyTokenResponse> {
    return firstValueFrom(this.svc.verifyToken(request));
  }
}
