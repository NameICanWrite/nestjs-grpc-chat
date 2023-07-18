import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, Max, Min, IsOptional } from "class-validator";
import { User, UserType } from "src/_proto/user.common.pb";
import { GetUserRequest, GetUserResponse, GetUsersRequest, GetUsersResponse, UpdateUserRequest } from "src/_proto/user.pb";

export class GetUsersRequestDto implements GetUsersRequest {

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    limit: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    offset: number;

    @ApiPropertyOptional({type: "array"})
    @IsArray()
    @IsOptional()
    users: number[];
}

export class GetUsersResponseDto implements GetUsersResponse {
    @ApiProperty({type: "array"})
    @IsArray()
    result: User[];

    @ApiProperty()
    @IsNumber()
    total: number;

    @ApiProperty()
    @IsNumber()
    limit: number;

    @ApiProperty()
    @IsNumber()
    offset: number;
}

export class GetUserRequestDto implements GetUserRequest {
    @ApiPropertyOptional({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER })
    @IsNumber()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    id?: number;
  
    @ApiProperty()
    @IsString()
    name?: string;
}

export class UpdateUserRequestDto implements UpdateUserRequest {
    @ApiPropertyOptional({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER })
    @IsNumber()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    id: number;
  
    @ApiProperty()
    @IsString()
    name?: string;
  
    @ApiProperty()
    @IsString()
    description?: string;
  
    @ApiPropertyOptional()
    @IsNumber()
    userTypeId?: number;

    @ApiPropertyOptional()
    @IsNumber()
    avatarFileId?: number;
}

export class GetUserResponseDto implements GetUserResponse {
    @ApiPropertyOptional({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER })
    @IsNumber()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    id: number;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    userType: UserType;

    @ApiPropertyOptional()
    @IsNumber()
    avatarFileId: number;

    @ApiProperty()
    @IsString()
    createdAt: string;

    @ApiProperty()
    @IsString()
    updatedAt: string;
}