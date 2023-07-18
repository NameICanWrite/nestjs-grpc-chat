import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';
import { AUTHORIZATION_SERVICE_NAME } from 'src/_proto/auth.pb';
import { USER_SERVICE_NAME } from 'src/_proto/user.pb';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000,
        maxRedirects: 5,
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTHORIZATION_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          return configService.get('grpc.grpcAuthOptions');
        },
        inject: [ConfigService],
      },
      {
        name: USER_SERVICE_NAME,
        useFactory: (configService: ConfigService) => {
          return configService.get('grpc.grpcUserOptions');
        },
        inject: [ConfigService],
      },
      
    ]),
  ],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
