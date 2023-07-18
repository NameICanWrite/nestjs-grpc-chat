import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { Chat, ChatType, Message } from 'src/_proto/chat.common.pb';

import {
  CHAT_SERVICE_NAME,
  ChatServiceClient,
  CreateChatRequest,
  GetChatsRequest,
  CreateMessageRequest,
  GetMessagesRequest,
  GetMessagesResponse,
  DeleteChatRequest,
  DeleteMessageRequest,
  GetChatsResponse,
  GetChatRequest,
  UpdateChatRequest,
  UpdateMessageRequest,
  GetMessageRequest,
  Empty,
  CreateChatTypeRequest
} from '../_proto/chat.pb';

@Injectable()
export class ChatService implements OnModuleInit {
  private svc: ChatServiceClient;

  @Inject(CHAT_SERVICE_NAME)
  private readonly grpcChatClient: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.grpcChatClient.getService<ChatServiceClient>(
      CHAT_SERVICE_NAME,
    );
  }

  public createChat(request: CreateChatRequest): Promise<Chat> {
    return firstValueFrom(this.svc.createChat(request));
  }

  public getChats(request: GetChatsRequest): Promise<GetChatsResponse> {
    return firstValueFrom(this.svc.getChats(request));
  }

  public getChat(request: GetChatRequest): Promise<Chat> {
    return firstValueFrom(this.svc.getChat(request));
  }

  public updateChat(request: UpdateChatRequest): Promise<Chat> {
    return firstValueFrom(this.svc.updateChat(request));
  }

  public deleteChat(request: DeleteChatRequest): Promise<Empty> {
    return firstValueFrom(this.svc.deleteChat(request));
  }

  public createMessage(request: CreateMessageRequest): Promise<Message> {
    return firstValueFrom(this.svc.createMessage(request));
  }

  public getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    return firstValueFrom(this.svc.getMessages(request));
  }

  public getMessage(request: GetMessageRequest): Promise<Message> {
    return firstValueFrom(this.svc.getMessage(request));
  }

  public updateMessage(request: UpdateMessageRequest): Promise<Message> {
    return firstValueFrom(this.svc.updateMessage(request));
  }

  public deleteMessage(request: DeleteMessageRequest): Promise<Empty> {
    return firstValueFrom(this.svc.deleteMessage(request));
  }

  public createChatType(request: CreateChatTypeRequest): Promise<ChatType> {
    return firstValueFrom(this.svc.createChatType(request));
  }
}
