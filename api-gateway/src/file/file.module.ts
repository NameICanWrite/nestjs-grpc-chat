import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ClientsModule } from '@nestjs/microservices';
import { FILE_SERVICE_NAME } from 'src/_proto/file.pb';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: FILE_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          return configService.get('grpc.grpcFileOptions');
        },
        inject: [ConfigService],
      },
    ]),
    UserModule
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
