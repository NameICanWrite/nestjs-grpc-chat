/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { FileInfo } from "./file.pb";
import { User, UserType } from "./user.common.pb";

export const protobufPackage = "user";

export interface CreateUserRequest {
  userTypeId?: number;
  name?: string;
  description?: string;
  password?: string;
}

export interface CreateUserResponse {
  id?: number;
  name?: string;
  description?: string;
  userType?: UserType;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetUsersRequest {
  limit?: number;
  offset?: number;
  users?: number[];
}

export interface GetUsersResponse {
  result?: User[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface GetUserRequest {
  id?: number | undefined;
  name?: string | undefined;
}

export interface GetUserResponse {
  id?: number;
  name?: string;
  description?: string;
  userType?: UserType;
  avatarFileId?: number;
  avatarFileInfo?: FileInfo | undefined;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  id?: number;
  name?: string | undefined;
  description?: string | undefined;
  userTypeId?: number | undefined;
  avatarFileId?: number | undefined;
}

export interface UpdateUserResponse {
  id?: number;
  name?: string;
  description?: string;
  userType?: UserType;
  avatarFileId?: number;
  avatarFileInfo?: FileInfo | undefined;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeleteUserRequest {
  id?: number;
}

export interface DeleteUserResponse {
}

export interface CreateUserTypeRequest {
  name?: string;
}

export interface CreateUserTypeResponse {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetUserTypesRequest {
  limit?: number;
  offset?: number;
}

export interface GetUserTypesResponse {
  result?: UserType[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface GetUserTypeRequest {
  id?: number;
}

export interface GetUserTypeResponse {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserTypeRequest {
  id?: number;
  name?: string;
}

export interface UpdateUserTypeResponse {
  id?: number;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeleteUserTypeRequest {
  id?: number;
}

export interface DeleteUserTypeResponse {
}

export interface VerifyPasswordRequest {
  userId?: number | undefined;
  userName?: string | undefined;
  password?: string;
}

export interface VerifyPasswordResponse {
  isValid?: boolean;
  userId?: number | undefined;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  createUser(request: CreateUserRequest, metadata?: Metadata): Observable<CreateUserResponse>;

  getUsers(request: GetUsersRequest, metadata?: Metadata): Observable<GetUsersResponse>;

  getUser(request: GetUserRequest, metadata?: Metadata): Observable<GetUserResponse>;

  updateUser(request: UpdateUserRequest, metadata?: Metadata): Observable<UpdateUserResponse>;

  deleteUser(request: DeleteUserRequest, metadata?: Metadata): Observable<DeleteUserResponse>;

  verifyPassword(request: VerifyPasswordRequest, metadata?: Metadata): Observable<VerifyPasswordResponse>;

  createUserType(request: CreateUserTypeRequest, metadata?: Metadata): Observable<CreateUserTypeResponse>;

  getUserTypes(request: GetUserTypesRequest, metadata?: Metadata): Observable<GetUserTypesResponse>;

  getUserType(request: GetUserTypeRequest, metadata?: Metadata): Observable<GetUserTypeResponse>;

  updateUserType(request: UpdateUserTypeRequest, metadata?: Metadata): Observable<UpdateUserTypeResponse>;

  deleteUserType(request: DeleteUserTypeRequest, metadata?: Metadata): Observable<DeleteUserTypeResponse>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
    metadata?: Metadata,
  ): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;

  getUsers(
    request: GetUsersRequest,
    metadata?: Metadata,
  ): Promise<GetUsersResponse> | Observable<GetUsersResponse> | GetUsersResponse;

  getUser(
    request: GetUserRequest,
    metadata?: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse;

  updateUser(
    request: UpdateUserRequest,
    metadata?: Metadata,
  ): Promise<UpdateUserResponse> | Observable<UpdateUserResponse> | UpdateUserResponse;

  deleteUser(
    request: DeleteUserRequest,
    metadata?: Metadata,
  ): Promise<DeleteUserResponse> | Observable<DeleteUserResponse> | DeleteUserResponse;

  verifyPassword(
    request: VerifyPasswordRequest,
    metadata?: Metadata,
  ): Promise<VerifyPasswordResponse> | Observable<VerifyPasswordResponse> | VerifyPasswordResponse;

  createUserType(
    request: CreateUserTypeRequest,
    metadata?: Metadata,
  ): Promise<CreateUserTypeResponse> | Observable<CreateUserTypeResponse> | CreateUserTypeResponse;

  getUserTypes(
    request: GetUserTypesRequest,
    metadata?: Metadata,
  ): Promise<GetUserTypesResponse> | Observable<GetUserTypesResponse> | GetUserTypesResponse;

  getUserType(
    request: GetUserTypeRequest,
    metadata?: Metadata,
  ): Promise<GetUserTypeResponse> | Observable<GetUserTypeResponse> | GetUserTypeResponse;

  updateUserType(
    request: UpdateUserTypeRequest,
    metadata?: Metadata,
  ): Promise<UpdateUserTypeResponse> | Observable<UpdateUserTypeResponse> | UpdateUserTypeResponse;

  deleteUserType(
    request: DeleteUserTypeRequest,
    metadata?: Metadata,
  ): Promise<DeleteUserTypeResponse> | Observable<DeleteUserTypeResponse> | DeleteUserTypeResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "getUsers",
      "getUser",
      "updateUser",
      "deleteUser",
      "verifyPassword",
      "createUserType",
      "getUserTypes",
      "getUserType",
      "updateUserType",
      "deleteUserType",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
