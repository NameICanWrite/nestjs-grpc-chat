import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ArrayContains } from 'typeorm';
import {
  AlreadyExistsException,
  InvalidArgumentException,
  NotFoundException,
  PermissionDeniedException,
} from '../utils/exceptions';
import { Chat } from './entities/chat.entity';
import { ChatType } from './entities/chat-type.entity';
import {
  GetChatRequest,
  DeleteChatRequest,
  GetChatsResponse,
  CreateChatRequest,
  UpdateChatRequest,
  CreateChatTypeRequest,
  GetChatTypeRequest,
  UpdateChatTypeRequest,
  DeleteChatTypeRequest,
  DeleteChatTypeResponse,
  GetChatTypesResponse,
  GetChatsRequest,
  GetChatTypesRequest,
  Empty,
  CreateMessageRequest,
  UpdateMessageRequest,
  GetMessageRequest,
  DeleteMessageRequest,
  GetMessagesRequest,
  GetMessagesResponse,

} from '../_proto/chat.pb';
import {
  ChatTypeEnum,
} from './chat.enum';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatType)
    private chatTypeRepository: Repository<ChatType>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>
  ) {}

  // Chat

  async createChat(
    createChatRequest: CreateChatRequest,
  ): Promise<Chat> {
    const {
      name,
      description,
      chatTypeId,
      users
    } = createChatRequest;


    const chatType = await this.chatTypeRepository.findOne({
      where: {
        id: chatTypeId,
      },
    });
    if (chatTypeId && !chatType) {
      throw new NotFoundException(`Chat type with id ${chatTypeId} not found`);
    }


    const newChat = {
      name,
      description,
      chatType,
      users,
      messages: []
    };
    return this.chatRepository.save(newChat);
  }

  async getChats(getChatsRequest: GetChatsRequest): Promise<GetChatsResponse> {
    const {
      limit,
      offset,
      chats,
      userId
    } = getChatsRequest;

    const shouldChooseChatsById = chats && (chats.length > 0)

    const [result, total] = await this.chatRepository.findAndCount({
      skip: offset,
      take: limit,
      where: {
        id: shouldChooseChatsById ? In(chats) : undefined,
        users: ArrayContains([userId]),
      },
      relations: {
        chatType: true,
        messages: true,
      },
    });

    console.log('chats found: ', result);
    console.log('total: ', total);
    
    return { result, total, limit, offset };
  }

  async getChat(getChatRequest: GetChatRequest): Promise<Chat> {
    const {
      id
    } = getChatRequest;

    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: {
        chatType: true,
        messages: true,
        },
      });
    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }
    return chat;
  }

  async updateChat(
    updateChatRequest: UpdateChatRequest,
  ): Promise<Chat> {
    const {
      id,
      chatTypeId,
      name,
      description
    } = updateChatRequest;
    const chat = await this.chatRepository.findOne({
      relations: {
        chatType: true,
      },
      where: {
        id,
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }

    const chatType = chatTypeId
      ? await this.chatTypeRepository.findOne({
          where: {
            id: chatTypeId,
          },
        })
      : undefined;

    if (chatTypeId && !chatType) {
      throw new NotFoundException(`Chat type with id ${chatTypeId} not found`);
    }

    const res = await this.chatRepository
      .createQueryBuilder('chat')
      .update(Chat)
      .set({ chatType, name, description })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return res.raw[0];
  }

  async deleteChat(
    deleteChatRequest: DeleteChatRequest,
  ): Promise<Empty> {
    const { id } = deleteChatRequest;
    const chat = await this.chatRepository.findOne({
      where: {
        id,
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }

    await this.chatRepository.delete({
      id,
    });

    return {};
  }

  // ChatType

  async createChatType(
    createChatTypeRequest: CreateChatTypeRequest,
  ): Promise<ChatType> {
    const { name } = createChatTypeRequest;
    const chatType = await this.chatTypeRepository.findOne({
      where: 
        {
          name,
        },
    });
    if (chatType) {
      throw new AlreadyExistsException(
        `Chat type with name ${name} already exists`,
      );
    }
    return this.chatTypeRepository.save(createChatTypeRequest);
  }

  async getChatTypes(
    getChatTypesRequest: GetChatTypesRequest,
  ): Promise<GetChatTypesResponse> {
    const { limit, offset } = getChatTypesRequest;
    const [result, total] = await this.chatTypeRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return { result, total, limit, offset };
  }

  async getChatType(
    getChatTypeRequest: GetChatTypeRequest,
  ): Promise<ChatType> {
    const { id } = getChatTypeRequest;
    const chatType = await this.chatTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!chatType) {
      throw new NotFoundException(`Chat type with id ${id} not found`);
    }
    return chatType;
  }

  async updateChatType(
    updateChatTypeRequest: UpdateChatTypeRequest,
  ): Promise<ChatType> {
    const { id, name } = updateChatTypeRequest;
    const chatType = await this.chatTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!chatType) {
      throw new NotFoundException(`Chat type with id ${id} not found`);
    }

    if (name) {
      const typeNameExists = await this.chatTypeRepository.findOne({
        where: { name },
      });
      if (typeNameExists && typeNameExists.id !== id) {
        throw new AlreadyExistsException(
          `Chat type with name ${name} already exists`,
        );
      }
    }

    return this.chatTypeRepository.save({
      id,
      name
    });
  }

  async deleteChatType(
    deleteChatTypeRequest: DeleteChatTypeRequest,
  ): Promise<DeleteChatTypeResponse> {
    const { id } = deleteChatTypeRequest;
    const chatType = await this.chatTypeRepository.findOne({
      where: {
        id,
      },
    });
    if (!chatType) {
      throw new NotFoundException(`Chat type with id ${id} not found`);
    }

    const typeInChats = await this.chatRepository.count({
      where: {
        chatType: {
          id,
        },
      },
    });
    if (typeInChats > 0) {
      throw new InvalidArgumentException(
        `Type ${chatType.name} is used in chats and cannot be deleted`,
      );
    }
    await this.chatTypeRepository.delete({
      id,
    });
    return {};
  }

  async createMessage(
    createMessageRequest: CreateMessageRequest,
  ): Promise<Message> {
    const { text, userId, chatId } = createMessageRequest;
    const chat = await this.chatRepository.findOne({where: {id: chatId}});
    if (!chat) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }
    if (!chat.users.includes(userId)) {
      throw new PermissionDeniedException(`Chat with id ${chatId} is not allowed for this user`);
    }

    return this.messageRepository.save({text, userId, chat: {id: chatId}});
  }

  async getMessages(
    getMessagesRequest: GetMessagesRequest,
  ): Promise<GetMessagesResponse> {
    const { limit, offset, chatId } = getMessagesRequest;
    const [result, total] = await this.messageRepository.findAndCount({
      where: {chat: {id: chatId}},
      relations: {chat: true},
      select: {
        id: true,
        text: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        chat: {id: true}
      },
      skip: offset,
      take: limit,
    });
    return { result, total, limit, offset };
  }

  async getMessage(
    getMessageRequest: GetMessageRequest,
  ): Promise<Message> {
    const { id } = getMessageRequest;
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });
    if (!message) {
      throw new NotFoundException(`message with id ${id} not found`);
    }
    return message;
  }

  async updateMessage(
    updateMessageRequest: UpdateMessageRequest,
  ): Promise<Message> {
    const { id, text } = updateMessageRequest;
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    return this.messageRepository.save({
      id,
      text
    });
  }

  async deleteMessage(
    deleteMessageRequest: DeleteMessageRequest,
  ): Promise<Empty> {
    const { id } = deleteMessageRequest;
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });
    if (!message) {
      throw new NotFoundException(`message with id ${id} not found`);
    }

    await this.messageRepository.delete({
      id,
    });
    return {};
  }
}
