import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesBuilder } from 'nest-access-control';
import { InjectRolesBuilder } from 'nest-access-control/decorators/inject-roles-builder.decorator';
import { RpcExceptionFilter } from '../utils/filters/grpc-exception.filter';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUserRequestDto, GetUserResponseDto, GetUsersRequestDto, UpdateUserRequestDto } from './user.dto';
import { UpdateUserResponse } from '../_proto/user.pb'

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseFilters(RpcExceptionFilter)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({ type: GetUsersRequestDto })
  async getUsers(@Param() getUsersDto: GetUsersRequestDto) {
    return this.userService.getUsers(getUsersDto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'get user by id',
  })
  @ApiResponse({ type: GetUserRequestDto })
  async getUser(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Get('/info')
  @ApiOperation({
    summary: 'get user from token',
  })
  @ApiResponse({ type: GetUserResponseDto })
  async getUserInfo(@Req() { user }) {
    return this.userService.getUser(user.id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'change user status',
  })
  @ApiBody({ type: UpdateUserRequestDto })
  @ApiResponse({ type: GetUserResponseDto })
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserRequestDto,
  ) {
    return this.userService.updateUser({ ...body, id: Number(id) });
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'delete user',
  })
  @ApiResponse({ schema: {} })
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
