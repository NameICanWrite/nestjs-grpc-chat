// src/chat/chat.gateway.ts

import { Req, UseFilters, UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    BaseWsExceptionFilter,
    WsException
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
import { AuthGuard, AuthSocketGuard } from 'src/auth/auth.guard';
  import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
  

  @UseGuards(AuthSocketGuard)
  @UseFilters(new BaseWsExceptionFilter())
  @WebSocketGateway(5001, {namespace: 'chat'})
  export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private chatService: ChatService) {}

    @WebSocketServer() 
    server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
    handleConnection(client: Socket) {
      console.log('Client connected: ', client.id);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected: ', client.id);
    }
  
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
      @ConnectedSocket() client: Socket,
      @MessageBody() payload: { roomId: string},
    ) {
        const userId = client.data.user.id
        const { roomId } = payload;

        const chat = await this.chatService.getChat({id: Number(roomId)})

        if (!chat) {
          throw new WsException('Could not find chat with id ' + roomId);
        }
        if (!chat.users.includes(userId)) {
          throw new WsException('This chat doesnt include user with id ' + userId)
        }

        client.join(roomId);
        
        console.log(`User ${userId} joined room ${roomId}`);
    }
  
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { roomId: string }) {
      const { roomId } = payload;
      client.leave(roomId);
      console.log(`User ${client.data.user.id} left room ${roomId}`);
    }
  
    @SubscribeMessage('sendMessage')
    async handleChatMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() payload: { roomId: string; text: string },
    ) {
      const { roomId, text } = payload;
      const user = client.data.user

      await this.chatService.createMessage({
        chatId: Number(roomId),
        userId: user.id,
        text,
      })

      this.server.to(roomId).emit('sendMessage', {
        userName: user.name,
        userId: user.id,
        text,
      });
    }
  }
  