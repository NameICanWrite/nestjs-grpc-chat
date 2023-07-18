import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fastify from 'fastify';
import { request } from 'http';
import { UserService } from 'src/user/user.service';
import { FileInfo } from 'src/_proto/file.pb';
import { User } from 'src/_proto/user.common.pb';
import { AuthGuard, AuthSocketGuard } from '../auth/auth.guard';
import { FileService } from './file.service';

@ApiTags('file')
@Controller('file')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService
    ) {}

  @Post('upload-avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        
        
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async setAvatar(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
    @Req() { user }: {user: User}
  ): Promise<any> {
    const files = await req.saveRequestFiles();
    if (files.some((file) => !file.filename)) {
      throw new BadRequestException('No files uploaded');
    }
    const avatarFileInfo = await this.fileService.createAvatarFile(files[0]);
    const updatedUser = await this.userService.updateUser({id: user.id, avatarFileId: avatarFileInfo.id})

    res.send({
      avatarFileInfo,
      updatedUser
    })
  }

  @Get('get-file-info/:id')
  async getFileInfoById(@Param('id') id: string): Promise<FileInfo> {
    return this.fileService.getFileInfoById({id: Number(id)});
  }

  // @Post('upload')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
        
        
  //       files: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //     },
  //   },
  // })
  // async uploadFile(
  //   @Req() req: fastify.FastifyRequest,
  //   @Res() res: fastify.FastifyReply<any>,
  // ): Promise<any> {
  //   const files = await req.saveRequestFiles();
  //   if (files.some((file) => !file.filename)) {
  //     throw new BadRequestException('No files uploaded');
  //   }
  //   return res.send(await this.fileService.createFile(files[0]));
  // }

}