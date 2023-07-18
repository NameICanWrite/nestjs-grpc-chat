import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateChatRequest, GetChatsRequest, GetChatsResponse } from "src/_proto/chat.pb";
import { Chat, ChatType, Message } from "src/_proto/chat.common.pb";

export class CreateChatRequestDto implements CreateChatRequest {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    chatTypeId: number;

    @ApiPropertyOptional()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    description: string;

    @ApiProperty({type: "array"})
    @ArrayMinSize(1)
    @IsArray()
    @IsNotEmpty()
    users: number[];
}

export class ChatDto implements Chat {
    @ApiPropertyOptional()
    @IsNumber()
    id: number;

    @ApiPropertyOptional()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    description: string;

    @ApiProperty({type: "array"})
    @ArrayMinSize(1)
    @IsArray()
    @IsNotEmpty()
    users: number[];

    @ApiProperty({type: "array"})
    @IsArray()
    @IsNotEmpty()
    messages: Message[];

    @ApiPropertyOptional()
    @IsString()
    createdAt: string;

    @ApiPropertyOptional()
    @IsString()
    updatedAt: string;

    chatType: ChatType;
}

export class GetChatsRequestDto implements Omit<GetChatsRequest, "userId"> {
    @ApiPropertyOptional()
    @IsNumber()
    limit: number;

    @ApiPropertyOptional()
    @IsNumber()
    offset: number;

    @ApiPropertyOptional({type: "array"})
    // @ArrayMinSize(1)
    // @IsArray()
    chats: number[];
}

export class GetChatsResponseDto implements GetChatsResponse {
    @ApiProperty({type: "array"})
    @ArrayMinSize(1)
    @IsArray()
    @IsNotEmpty()
    result: Chat[];

    @ApiProperty()
    @IsNumber()
    total: number;

    @ApiPropertyOptional()
    @IsNumber()
    limit: number;

    @ApiPropertyOptional()
    @IsNumber()
    offset: number;
}