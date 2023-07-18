import { Metadata } from '@grpc/grpc-js';
import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateUserRequest } from 'src/_proto/user.pb';
import { RpcExceptionFilter } from '../utils/exceptions';
import {
  AUTHORIZATION_SERVICE_NAME,
  AuthorizationController,
  AuthorizationControllerMethods,
  AuthorizationToken,
  SignInRequest,
  VerifyTokenResponse,
} from '../_proto/auth.pb';
import { AuthService } from './auth.service';

@AuthorizationControllerMethods()
@Controller()
export class AuthController implements AuthorizationController {
  constructor(private readonly authService: AuthService) {}


  @GrpcMethod(AUTHORIZATION_SERVICE_NAME, 'SignIn')
  @UseFilters(RpcExceptionFilter.for('AuthController::signIn'))
  signIn(signInRequest: SignInRequest): Promise<AuthorizationToken> {
    return this.authService.signIn(signInRequest);
  }

  @GrpcMethod(AUTHORIZATION_SERVICE_NAME, 'VerifyToken')
  @UseFilters(RpcExceptionFilter.for('AuthController::verifyToken'))
  verifyToken(request: AuthorizationToken, _metadata?: Metadata): Promise<VerifyTokenResponse> {
    return this.authService.verifyToken(request)
  }

  @GrpcMethod(AUTHORIZATION_SERVICE_NAME, 'SignUp')
  @UseFilters(RpcExceptionFilter.for('AuthController::signUp'))
  async signUp(request: CreateUserRequest, metadata?: Metadata): Promise<AuthorizationToken> {
    return this.authService.signUp(request);
  }
}
