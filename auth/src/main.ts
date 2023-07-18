import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AUTH_PACKAGE_NAME } from './_proto/auth.pb';
import { HEALTH_CHECK_PACKAGE_NAME } from './_proto/health-check.pb';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: configService.get<string>('app.url'),
        package: [HEALTH_CHECK_PACKAGE_NAME, AUTH_PACKAGE_NAME],
        protoPath: [
          join(__dirname, '_proto/health-check.proto'),
          join(__dirname, '_proto/auth.proto'),
        ],
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      },
    },
  );

  app.useLogger(app.get(Logger));
  await app.listen();
  console.log(
    'Microservice is listening',
    configService.get<string>('app.url'),
  );
}

bootstrap();
