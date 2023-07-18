import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Chat } from 'src/_proto/chat.common.pb';
import { CreateChatRequest } from 'src/_proto/chat.pb';
import { AuthGuard, AuthSocketGuard } from '../auth/auth.guard';
import { ChatDto, CreateChatRequestDto, GetChatsRequestDto, GetChatsResponseDto } from './chat.dto';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiBody({ type: CreateChatRequestDto })
  @ApiOperation({summary: 'Create chat'})
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ChatDto,
  })
  createChat(@Body() createChatRequest: CreateChatRequest): Promise<Chat> {
    return this.chatService.createChat(createChatRequest);
  }

  // TODO: Add dto for responses

  @Get()
  @ApiOperation({
    summary: 'get chats',
  })
  @ApiResponse({
    type: GetChatsResponseDto,
    isArray: true,
    status: 200,
  })
  async getChatsByCurrentUser(@Req() {user}, @Query() getChatsRequest: GetChatsRequestDto) {
    return this.chatService.getChats({...getChatsRequest, userId: user.id});
  }
}
