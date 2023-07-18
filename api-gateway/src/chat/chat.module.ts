import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { CHAT_SERVICE_NAME } from 'src/_proto/chat.pb';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CHAT_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          return configService.get('grpc.grpcChatOptions');
        },
        inject: [ConfigService],
      },
    ]),
    AuthModule
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
