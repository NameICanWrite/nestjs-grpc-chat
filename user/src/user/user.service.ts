import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt'
import {
  AlreadyExistsException,
  InvalidArgumentException,
  NotFoundException,
  PermissionDeniedException,
} from '../utils/exceptions';
import { User } from './entities/user.entity';
import { UserType } from './entities/user-type.entity';
import {
  GetUserResponse,
  GetUserRequest,
  DeleteUserRequest,
  DeleteUserResponse,
  GetUsersResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  CreateUserTypeRequest,
  UpdateUserResponse,
  CreateUserTypeResponse,
  GetUserTypeRequest,
  UpdateUserTypeRequest,
  DeleteUserTypeRequest,
  DeleteUserTypeResponse,
  GetUserTypeResponse,
  GetUserTypesResponse,
  UpdateUserTypeResponse,
  GetUsersRequest,
  GetUserTypesRequest,
  VerifyPasswordRequest,
  VerifyPasswordResponse,

} from '../_proto/user.pb';
import {
  UserTypeEnum,
} from './user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserType)
    private userTypeRepository: Repository<UserType>
  ) {}

  // User

  async createUser(
    createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    const {
      name,
      description,
      userTypeId,
      password
    } = createUserRequest;

    const existingUser = await this.userRepository.findOne({where: {name}})
    if (existingUser) {
      throw new AlreadyExistsException('User already exists. Choose different name')
    }

    const userType = await this.userTypeRepository.findOne({
      where: {
        id: userTypeId,
      },
    });
    if (userTypeId && !userType) {
      throw new NotFoundException(`User type with id ${userTypeId} not found`);
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      name,
      description,
      userType,
      password: hashedPassword
    };
    return this.userRepository.save(newUser);
  }

  async getUsers(getUsersRequest: GetUsersRequest): Promise<GetUsersResponse> {
    const {
      limit,
      offset,
      users,
    } = getUsersRequest;

    const [result, total] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
      where: {
        id: users ? In(users) : undefined,
      },
      relations: {
        userType: true,
      },
    });
    
    return { result, total, limit, offset };
  }

  async getUser(getUserRequest: GetUserRequest): Promise<GetUserResponse> {
    const {
      id, name
    } = getUserRequest;

    let user: User
    if (id) {
      user = await this.userRepository.findOne({
        where: { id },
        relations: {
          userType: true,
          },
        });
    } else if (name) {
      user = await this.userRepository.findOne({
        where: { name },
        relations: {
          userType: true,
          },
        });
    }
    
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(
    updateUserRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const {
      id,
      userTypeId,
      name,
      description,
      avatarFileId
    } = updateUserRequest;
    const user = await this.userRepository.findOne({
      relations: {
        userType: true,
      },
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const userType = userTypeId
      ? await this.userTypeRepository.findOne({
          where: {
            id: userTypeId,
          },
        })
      : undefined;

    if (userTypeId && !userType) {
      throw new NotFoundException(`User type with id ${userTypeId} not found`);
    }

    const res = await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({ userType, name, description, avatarFileId })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return res.raw[0];
  }

  async deleteUser(
    deleteUserRequest: DeleteUserRequest,
  ): Promise<DeleteUserResponse> {
    const { id } = deleteUserRequest;
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.delete({
      id,
    });

    return {};
  }

  async VerifyPassword(
    verifyPasswordRequest: VerifyPasswordRequest,
  ): Promise<VerifyPasswordResponse> {
    const {password, userName, userId} = verifyPasswordRequest
    let user: User

    if (userId) {
      user = await this.userRepository.findOne({where: {id: userId}})
    } else if (userName) {
      user = await this.userRepository.findOne({where: {name: userName}})
    } 

    if (!user) {
      return { isValid: false}
    }

    console.log(user);
    console.log(password);

    const isValid = await bcrypt.compare(password, user.password)
    return { 
      isValid, 
      userId: user.id
    }
  }

  // UserType

  async createUserType(
    createUserTypeRequest: CreateUserTypeRequest,
  ): Promise<CreateUserTypeResponse> {
    const { name } = createUserTypeRequest;
    const userType = await this.userTypeRepository.findOne({
      where: 
        {
          name,
        },
    });
    if (userType) {
      throw new AlreadyExistsException(
        `User type with name ${name} already exists`,
      );
    }
    return this.userTypeRepository.save(createUserTypeRequest);
  }

  async getUserTypes(
    getUserTypesRequest: GetUserTypesRequest,
  ): Promise<GetUserTypesResponse> {
    const { limit, offset } = getUserTypesRequest;
    const [result, total] = await this.userTypeRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return { result, total, limit, offset };
  }

  async getUserType(
    getUserTypeRequest: GetUserTypeRequest,
  ): Promise<GetUserTypeResponse> {
    const { id } = getUserTypeRequest;
    const userType = await this.userTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!userType) {
      throw new NotFoundException(`User type with id ${id} not found`);
    }
    return userType;
  }

  async updateUserType(
    updateUserTypeRequest: UpdateUserTypeRequest,
  ): Promise<UpdateUserTypeResponse> {
    const { id, name } = updateUserTypeRequest;
    const userType = await this.userTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!userType) {
      throw new NotFoundException(`User type with id ${id} not found`);
    }

    if (name) {
      const typeNameExists = await this.userTypeRepository.findOne({
        where: { name },
      });
      if (typeNameExists && typeNameExists.id !== id) {
        throw new AlreadyExistsException(
          `User type with name ${name} already exists`,
        );
      }
    }

    return this.userTypeRepository.save({
      id,
      name
    });
  }

  async deleteUserType(
    deleteUserTypeRequest: DeleteUserTypeRequest,
  ): Promise<DeleteUserTypeResponse> {
    const { id } = deleteUserTypeRequest;
    const userType = await this.userTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!userType) {
      throw new NotFoundException(`User type with id ${id} not found`);
    }

    const typeInUsers = await this.userRepository.count({
      where: {
        userType: {
          id,
        },
      },
    });
    if (typeInUsers > 0) {
      throw new InvalidArgumentException(
        `Type ${userType.name} is used in users and cannot be deleted`,
      );
    }
    await this.userTypeRepository.delete({
      id,
    });
    return {};
  }
}
