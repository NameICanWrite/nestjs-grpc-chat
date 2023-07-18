import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Chat, Message } from 'src/_proto/chat.common.pb';
import { RpcExceptionFilter } from '../utils/exceptions';
import {
  CreateChatRequest,
  CreateChatTypeRequest,
  DeleteChatRequest,
  DeleteChatResponse,
  GetChatRequest,
  GetChatsResponse,
  CHAT_SERVICE_NAME,
  UpdateChatRequest,
  ChatServiceControllerMethods,
  ChatServiceController,
  DeleteChatTypeRequest,
  DeleteChatTypeResponse,
  GetChatTypeRequest,
  GetChatTypesResponse,
  UpdateChatTypeRequest,
  GetChatsRequest,
  GetChatTypesRequest,
  CreateMessageRequest,
  GetMessagesRequest,
  GetMessagesResponse,
  GetMessageRequest,
  UpdateMessageRequest,
  Empty,
  DeleteMessageRequest,
} from '../_proto/chat.pb';
import { ChatService } from './chat.service';
import { ChatType } from './entities/chat-type.entity';

@ChatServiceControllerMethods()
@Controller()
export class ChatController implements ChatServiceController {
  constructor(private readonly chatService: ChatService) {}

  // Chat

  @GrpcMethod(CHAT_SERVICE_NAME, 'CreateChat')
  @UseFilters(RpcExceptionFilter.for('ChatController::CreateChat'))
  createChat(
    createChatRequest: CreateChatRequest,
  ): Promise<Chat> {
    return this.chatService.createChat(createChatRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'GetChats')
  @UseFilters(RpcExceptionFilter.for('ChatController::GetChats'))
  getChats(getChatsRequest: GetChatsRequest): Promise<GetChatsResponse> {
    return this.chatService.getChats(getChatsRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'GetChat')
  @UseFilters(RpcExceptionFilter.for('ChatController::GetChat'))
  getChat(chatRequest: GetChatRequest): Promise<Chat> {
    return this.chatService.getChat(chatRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'UpdateChat')
  @UseFilters(RpcExceptionFilter.for('ChatController::UpdateChat'))
  updateChat(
    updateChatRequest: UpdateChatRequest,
  ): Promise<Chat> {
    return this.chatService.updateChat(updateChatRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'DeleteChat')
  @UseFilters(RpcExceptionFilter.for('ChatController::DeleteChat'))
  deleteChat(
    deleteChatRequest: DeleteChatRequest,
  ): Promise<DeleteChatResponse> {
    return this.chatService.deleteChat(deleteChatRequest);
  }

  // ChatType

  @GrpcMethod(CHAT_SERVICE_NAME, 'CreateChatType')
  @UseFilters(RpcExceptionFilter.for('ChatController::CreateChatType'))
  createChatType(
    createChatTypeRequest: CreateChatTypeRequest,
  ): Promise<ChatType> {
    return this.chatService.createChatType(createChatTypeRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'GetChatTypes')
  @UseFilters(RpcExceptionFilter.for('ChatController::GetChatTypes'))
  getChatTypes(
    getChatTypesRequest: GetChatTypesRequest,
  ): Promise<GetChatTypesResponse> {
    return this.chatService.getChatTypes(getChatTypesRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'GetChatType')
  @UseFilters(RpcExceptionFilter.for('ChatController::GetChatType'))
  getChatType(
    getChatTypeRequest: GetChatTypeRequest,
  ): Promise<ChatType> {
    return this.chatService.getChatType(getChatTypeRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'UpdateChatType')
  @UseFilters(RpcExceptionFilter.for('ChatController::UpdateChatType'))
  updateChatType(
    updateChatTypeRequest: UpdateChatTypeRequest,
  ): Promise<ChatType> {
    return this.chatService.updateChatType(updateChatTypeRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'DeleteChatType')
  @UseFilters(RpcExceptionFilter.for('ChatController::DeleteChatType'))
  deleteChatType(
    deleteChatTypeRequest: DeleteChatTypeRequest,
  ): Promise<DeleteChatTypeResponse> {
    return this.chatService.deleteChatType(deleteChatTypeRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'CreateMessage')
  @UseFilters(RpcExceptionFilter.for('ChatController::CreateMessage'))
  createMessage(
    createMessageRequest: CreateMessageRequest,
  ): Promise<Message> {
    return this.chatService.createMessage(createMessageRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'GetMessages')
  @UseFilters(RpcExceptionFilter.for('ChatController::GetMessages'))
  getMessages(
    getMessagesRequest: GetMessagesRequest,
  ): Promise<GetMessagesResponse> {
    return this.chatService.getMessages(getMessagesRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'GetMessage')
  @UseFilters(RpcExceptionFilter.for('ChatController::GetMessage'))
  getMessage(
    getMessageRequest: GetMessageRequest,
  ): Promise<Message> {
    return this.chatService.getMessage(getMessageRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'UpdateMessage')
  @UseFilters(RpcExceptionFilter.for('ChatController::UpdateMessage'))
  updateMessage(
    updateMessageRequest: UpdateMessageRequest,
  ): Promise<Message> {
    return this.chatService.updateMessage(updateMessageRequest);
  }

  @GrpcMethod(CHAT_SERVICE_NAME, 'DeleteMessage')
  @UseFilters(RpcExceptionFilter.for('ChatController::DeleteMessage'))
  deleteMessage(
    deleteMessageRequest: DeleteMessageRequest,
  ): Promise<Empty> {
    return this.chatService.deleteMessage(deleteMessageRequest);
  }
}
