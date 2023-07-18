/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CreateUserRequest } from "./user.pb";

export const protobufPackage = "auth";

export interface Stub {
}

export interface AuthorizationToken {
  token: string;
}

export interface VerifyTokenResponse {
  isValid: boolean;
}

export interface SignInRequest {
  login: string;
  password: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthorizationClient {
  signIn(request: SignInRequest, metadata?: Metadata): Observable<AuthorizationToken>;

  signUp(request: CreateUserRequest, metadata?: Metadata): Observable<AuthorizationToken>;

  verifyToken(request: AuthorizationToken, metadata?: Metadata): Observable<VerifyTokenResponse>;
}

export interface AuthorizationController {
  signIn(
    request: SignInRequest,
    metadata?: Metadata,
  ): Promise<AuthorizationToken> | Observable<AuthorizationToken> | AuthorizationToken;

  signUp(
    request: CreateUserRequest,
    metadata?: Metadata,
  ): Promise<AuthorizationToken> | Observable<AuthorizationToken> | AuthorizationToken;

  verifyToken(
    request: AuthorizationToken,
    metadata?: Metadata,
  ): Promise<VerifyTokenResponse> | Observable<VerifyTokenResponse> | VerifyTokenResponse;
}

export function AuthorizationControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["signIn", "signUp", "verifyToken"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Authorization", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Authorization", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTHORIZATION_SERVICE_NAME = "Authorization";
