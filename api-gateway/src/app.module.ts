import { 
  // CacheModule, 
  Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { JwtModule } from '@nestjs/jwt';
import { AccessControlModule, RolesBuilder } from 'nest-access-control';
import { validate } from './utils/validators/env.validation';
import { HealthCheckModule } from './health-check/health-check.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import grpcConfig from './config/grpc.config';
import redisConfig from './config/redis.config';
import throttlerConfig from './config/throttler.config';
import databaseConfig from './config/database.config';
import fileConfig from './config/file.config';
import hookConfig from './config/hook.config';
import { UserService } from './user/user.service';
import { TemplateModule } from './template/template.module';
import { ChatModule } from './chat/chat.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === 'test'
          ? '.env.test'
          : '.env.development.local',
        '.env.development',
        '.env',
      ],
      validate,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        throttlerConfig,
        fileConfig,
        hookConfig,
        grpcConfig,
      ],
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   store: async () =>
    //     redisStore({
    //       // TODO: See this issue to track the progress of this upgrade. (https://github.com/dabroek/node-cache-manager-redis-store/issues/40)
    //       socket: {
    //         host: process.env.REDIS_HOST,
    //         port: Number(process.env.REDIS_PORT),
    //       },
    //       database: Number(process.env.REDIS_DATABASE),
    //     }),
    // }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        pinoHttp:
          configService.get<string>('app.nodeEnv') === 'development'
            ? {
                level: configService.get<string>('app.logLevel'),
                transport: {
                  target: 'pino-pretty',
                  options: {
                    levelFirst: true,
                    translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
                    singleLine: true,
                    colorize: true,
                  },
                },
              }
            : {
                level: configService.get<string>('app.logLevel'),
                transport: {
                  target: 'pino-pretty',
                  options: {
                    levelFirst: true,
                    translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
                    singleLine: true,
                    colorize: true,
                  },
                },
                stream: pino.destination({
                  dest: configService.get<string>('app.logFile'),
                  minLength: 4096,
                  sync: false,
                }),
              },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('throttle.ttl'),
        limit: configService.get<number>('throttle.limit'),
      }),
      inject: [ConfigService],
    }),
    HealthCheckModule,
    AuthModule,
    JwtModule,
    UserModule,
    ChatModule,
    FileModule,
    AccessControlModule.forRootAsync({
      imports: [UserModule],
      useFactory: async (userService: UserService): Promise<RolesBuilder> => {
        await userService.onModuleInit();
        const roleBuilder = new RolesBuilder(
        );
        console.log('roleBuilder', roleBuilder.getRoles());
        console.log('roleBuilder', roleBuilder.getGrants());
        return roleBuilder;
      },
      inject: [UserService],
    }),
    TemplateModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
