import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcExceptionFilter } from '../utils/exceptions';
import {
  CreateUserRequest,
  CreateUserResponse,
  CreateUserTypeRequest,
  CreateUserTypeResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserRequest,
  GetUserResponse,
  GetUsersResponse,
  USER_SERVICE_NAME,
  UpdateUserRequest,
  UpdateUserResponse,
  UserServiceControllerMethods,
  UserServiceController,
  DeleteUserTypeRequest,
  DeleteUserTypeResponse,
  GetUserTypeRequest,
  GetUserTypeResponse,
  GetUserTypesResponse,
  UpdateUserTypeRequest,
  UpdateUserTypeResponse,
  GetUsersRequest,
  GetUserTypesRequest,
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '../_proto/user.pb';
import { UserService } from './user.service';

@UserServiceControllerMethods()
@Controller()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  // User

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  @UseFilters(RpcExceptionFilter.for('UserController::CreateUser'))
  createUser(
    createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.userService.createUser(createUserRequest);
  }


  @GrpcMethod(USER_SERVICE_NAME, 'GetUsers')
  @UseFilters(RpcExceptionFilter.for('UserController::GetUsers'))
  getUsers(getUsersRequest: GetUsersRequest): Promise<GetUsersResponse> {
    return this.userService.getUsers(getUsersRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUser')
  @UseFilters(RpcExceptionFilter.for('UserController::GetUser'))
  getUser(userRequest: GetUserRequest): Promise<GetUserResponse> {
    return this.userService.getUser(userRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  @UseFilters(RpcExceptionFilter.for('UserController::UpdateUser'))
  updateUser(
    updateUserRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return this.userService.updateUser(updateUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  @UseFilters(RpcExceptionFilter.for('UserController::DeleteUser'))
  deleteUser(
    deleteUserRequest: DeleteUserRequest,
  ): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(deleteUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'VerifyPassword')
  @UseFilters(RpcExceptionFilter.for('UserController::VerifyPassword'))
  verifyPassword(
    verifyPasswordRequest: VerifyPasswordRequest
  ): Promise <VerifyPasswordResponse> {
    return this.userService.VerifyPassword(verifyPasswordRequest)
  }  // UserType

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUserType')
  @UseFilters(RpcExceptionFilter.for('UserController::CreateUserType'))
  createUserType(
    createUserTypeRequest: CreateUserTypeRequest,
  ): Promise<CreateUserTypeResponse> {
    return this.userService.createUserType(createUserTypeRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserTypes')
  @UseFilters(RpcExceptionFilter.for('UserController::GetUserTypes'))
  getUserTypes(
    getUserTypesRequest: GetUserTypesRequest,
  ): Promise<GetUserTypesResponse> {
    return this.userService.getUserTypes(getUserTypesRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserType')
  @UseFilters(RpcExceptionFilter.for('UserController::GetUserType'))
  getUserType(
    getUserTypeRequest: GetUserTypeRequest,
  ): Promise<GetUserTypeResponse> {
    return this.userService.getUserType(getUserTypeRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUserType')
  @UseFilters(RpcExceptionFilter.for('UserController::UpdateUserType'))
  updateUserType(
    updateUserTypeRequest: UpdateUserTypeRequest,
  ): Promise<UpdateUserTypeResponse> {
    return this.userService.updateUserType(updateUserTypeRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUserType')
  @UseFilters(RpcExceptionFilter.for('UserController::DeleteUserType'))
  deleteUserType(
    deleteUserTypeRequest: DeleteUserTypeRequest,
  ): Promise<DeleteUserTypeResponse> {
    return this.userService.deleteUserType(deleteUserTypeRequest);
  }
}
