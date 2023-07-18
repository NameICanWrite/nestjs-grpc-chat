/* eslint-disable import/no-cycle */
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { ChatType } from './chat-type.entity';
import { Message } from './message.entity';
import {Chat as ProtoChat} from '../../_proto/chat.common.pb'

@Entity({ name: 'chat' })
export class Chat extends EntityHelper implements ProtoChat {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => ChatType)
  chatType: ChatType;

  @Column("int", {array: true})
  users: number[]

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}

