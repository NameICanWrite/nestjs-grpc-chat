import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
  GetUserResponse,
  GetUsersResponse,
  DeleteUserResponse,
  UpdateUserResponse,
} from '../_proto/user.pb';
import { GetUserRequestDto, GetUsersRequestDto, UpdateUserRequestDto } from './user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private userServiceClient: UserServiceClient;

  @Inject(USER_SERVICE_NAME)
  private readonly grpcUserClient: ClientGrpc;

  public onModuleInit(): void {
    this.userServiceClient =
      this.grpcUserClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async getUsers(body: GetUsersRequestDto): Promise<GetUsersResponse> {
    return firstValueFrom(this.userServiceClient.getUsers(body));
  }

  public async getUser(id: number): Promise<GetUserResponse> {
    return firstValueFrom(
      this.userServiceClient.getUser({ id }),
    );
  }

  public async updateUser(body: UpdateUserRequestDto): Promise<UpdateUserResponse> {
    return firstValueFrom(this.userServiceClient.updateUser(body));
  }

  public async deleteUser(id: number): Promise<DeleteUserResponse> {
    return firstValueFrom(this.userServiceClient.deleteUser({ id }));
  }
}
