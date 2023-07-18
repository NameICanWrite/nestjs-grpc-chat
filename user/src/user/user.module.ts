import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserType } from './entities/user-type.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserType,
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
