import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import {CreateUserRequest} from '../../_proto/user.pb'

export class AuthSignUpDto implements CreateUserRequest {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userTypeId: number;

    @ApiProperty({ minLength: 1, maxLength: 250 })
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(250)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
}