import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthCheckModule } from './health-check/health-check.module';
import { validate } from './utils/validators/environment.validator';
import appConfig from './config/app.config';
import crmAuthConfig from './config/crm-auth.config';
import jwtConfig from './config/jwt.config';
import grpcConfig from './config/grpc.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      validate,
      load: [appConfig, crmAuthConfig, jwtConfig, grpcConfig],
    }),
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
                stream: pino.destination({
                  dest: configService.get<string>('app.logFile'),
                  minLength: 4096,
                  sync: false,
                }),
              },
      }),
      inject: [ConfigService],
    }),
    HealthCheckModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
