import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthCheckModule } from './health-check/health-check.module';
import { validate } from './utils/validators/environment.validator';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      validate,
      load: [databaseConfig, appConfig],
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
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    ChatModule,
    HealthCheckModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
