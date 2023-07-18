/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Chat, ChatType, Message } from "./chat.common.pb";

export const protobufPackage = "chat";

export interface Empty {
}

export interface CreateChatRequest {
  chatTypeId?: number;
  name?: string;
  description?: string;
  users?: number[];
}

export interface GetChatsRequest {
  limit?: number;
  offset?: number;
  chats?: number[];
  userId?: number;
}

export interface GetChatsResponse {
  result?: Chat[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface GetChatRequest {
  id?: number;
}

export interface UpdateChatRequest {
  id?: number;
  name?: string;
  description?: string;
  chatTypeId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeleteChatRequest {
  id?: number;
}

export interface DeleteChatResponse {
}

export interface CreateChatTypeRequest {
  name?: string;
}

export interface GetChatTypesRequest {
  limit?: number;
  offset?: number;
}

export interface GetChatTypesResponse {
  result?: ChatType[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface GetChatTypeRequest {
  id?: number;
}

export interface UpdateChatTypeRequest {
  id?: number;
  name?: string;
}

export interface DeleteChatTypeRequest {
  id?: number;
}

export interface DeleteChatTypeResponse {
}

export interface CreateMessageRequest {
  chatId?: number;
  userId?: number;
  text?: string;
}

export interface GetMessagesRequest {
  limit?: number;
  offset?: number;
  messages?: number[];
  chatId?: number;
}

export interface GetMessagesResponse {
  result?: Message[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface GetMessageRequest {
  id?: number;
}

export interface UpdateMessageRequest {
  id?: number;
  text?: string;
}

export interface DeleteMessageRequest {
  id?: number;
}

export const CHAT_PACKAGE_NAME = "chat";

export interface ChatServiceClient {
  createChat(request: CreateChatRequest, metadata?: Metadata): Observable<Chat>;

  getChats(request: GetChatsRequest, metadata?: Metadata): Observable<GetChatsResponse>;

  getChat(request: GetChatRequest, metadata?: Metadata): Observable<Chat>;

  updateChat(request: UpdateChatRequest, metadata?: Metadata): Observable<Chat>;

  deleteChat(request: DeleteChatRequest, metadata?: Metadata): Observable<Empty>;

  createChatType(request: CreateChatTypeRequest, metadata?: Metadata): Observable<ChatType>;

  getChatTypes(request: GetChatTypesRequest, metadata?: Metadata): Observable<GetChatTypesResponse>;

  getChatType(request: GetChatTypeRequest, metadata?: Metadata): Observable<ChatType>;

  updateChatType(request: UpdateChatTypeRequest, metadata?: Metadata): Observable<ChatType>;

  deleteChatType(request: DeleteChatTypeRequest, metadata?: Metadata): Observable<Empty>;

  createMessage(request: CreateMessageRequest, metadata?: Metadata): Observable<Message>;

  getMessages(request: GetMessagesRequest, metadata?: Metadata): Observable<GetMessagesResponse>;

  getMessage(request: GetMessageRequest, metadata?: Metadata): Observable<Message>;

  updateMessage(request: UpdateMessageRequest, metadata?: Metadata): Observable<Message>;

  deleteMessage(request: DeleteMessageRequest, metadata?: Metadata): Observable<Empty>;
}

export interface ChatServiceController {
  createChat(request: CreateChatRequest, metadata?: Metadata): Promise<Chat> | Observable<Chat> | Chat;

  getChats(
    request: GetChatsRequest,
    metadata?: Metadata,
  ): Promise<GetChatsResponse> | Observable<GetChatsResponse> | GetChatsResponse;

  getChat(request: GetChatRequest, metadata?: Metadata): Promise<Chat> | Observable<Chat> | Chat;

  updateChat(request: UpdateChatRequest, metadata?: Metadata): Promise<Chat> | Observable<Chat> | Chat;

  deleteChat(request: DeleteChatRequest, metadata?: Metadata): Promise<Empty> | Observable<Empty> | Empty;

  createChatType(
    request: CreateChatTypeRequest,
    metadata?: Metadata,
  ): Promise<ChatType> | Observable<ChatType> | ChatType;

  getChatTypes(
    request: GetChatTypesRequest,
    metadata?: Metadata,
  ): Promise<GetChatTypesResponse> | Observable<GetChatTypesResponse> | GetChatTypesResponse;

  getChatType(request: GetChatTypeRequest, metadata?: Metadata): Promise<ChatType> | Observable<ChatType> | ChatType;

  updateChatType(
    request: UpdateChatTypeRequest,
    metadata?: Metadata,
  ): Promise<ChatType> | Observable<ChatType> | ChatType;

  deleteChatType(request: DeleteChatTypeRequest, metadata?: Metadata): Promise<Empty> | Observable<Empty> | Empty;

  createMessage(request: CreateMessageRequest, metadata?: Metadata): Promise<Message> | Observable<Message> | Message;

  getMessages(
    request: GetMessagesRequest,
    metadata?: Metadata,
  ): Promise<GetMessagesResponse> | Observable<GetMessagesResponse> | GetMessagesResponse;

  getMessage(request: GetMessageRequest, metadata?: Metadata): Promise<Message> | Observable<Message> | Message;

  updateMessage(request: UpdateMessageRequest, metadata?: Metadata): Promise<Message> | Observable<Message> | Message;

  deleteMessage(request: DeleteMessageRequest, metadata?: Metadata): Promise<Empty> | Observable<Empty> | Empty;
}

export function ChatServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createChat",
      "getChats",
      "getChat",
      "updateChat",
      "deleteChat",
      "createChatType",
      "getChatTypes",
      "getChatType",
      "updateChatType",
      "deleteChatType",
      "createMessage",
      "getMessages",
      "getMessage",
      "updateMessage",
      "deleteMessage",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ChatService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ChatService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CHAT_SERVICE_NAME = "ChatService";
