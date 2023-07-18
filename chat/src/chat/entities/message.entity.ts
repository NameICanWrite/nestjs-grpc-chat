import { User } from "src/_proto/user.common.pb";
import { Column, Entity, ManyToOne } from "typeorm";
import { Chat } from "./chat.entity";
import { Message as ProtoMessage } from "../../_proto/chat.common.pb"
import { EntityHelper } from "src/utils/entity-helper";

@Entity({name: "message"})
export class Message extends EntityHelper implements ProtoMessage {

    @Column()
    userId: number;

    @Column()
    text: string;

    @ManyToOne(() => Chat, chat => chat.messages)
    chat: Chat;
}