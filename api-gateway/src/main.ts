import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from '@fastify/helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import fmp = require('@fastify/multipart');

import compression from '@fastify/compress';
import { useContainer } from 'class-validator';
import { camelCase, startCase } from 'lodash';
import { AppModule } from './app.module';

// TODO: for development only
const CORS_OPTIONS = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3333',
    'https://pm.dzencode.com',
    /\.pm-dev\.dzencode\.net$/,
    // /^(https:\/\/([^.]*\.)?pm-dev.dzencode\.net)$/i,
  ], // or '*' or whatever is required
  allowedHeaders: [
    'Access-Control-Allow-Origin',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Content-Type',
    'Authorization',
  ],
  exposedHeaders: 'Authorization',
  credentials: true,
  methods: ['GET', 'PUT', 'PATCH', 'OPTIONS', 'POST', 'DELETE'],
};

async function bootstrap() {
  const adapter = new FastifyAdapter();
  adapter.enableCors(CORS_OPTIONS);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bufferLogs: true,
    },
  );

  app.useLogger(app.get(Logger));

  // await app.register(compression);

  // await app.register(helmet);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // @ts-ignore
  await app.register(fmp, {
    limits: {
      fileSize: 200 * 1024 * 1024,
    },
  });

  const config = new DocumentBuilder()
    // .setExternalDoc('API Docs', '/docs')
    .setTitle('API Gateway microservices')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return `${controllerKey
        .toLowerCase()
        .replace('controller', '')}${startCase(camelCase(methodKey)).replace(
        / /g,
        '',
      )}`;
    },
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      displayOperationId: true,
      docExpansion: 'none',
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const host = configService.get('HOST');
  await app.listen(port || 3000, host);
  console.log(
    `[Api Gateway] Listening on port ${port} on ${await app.getUrl()}`,
  );
}
bootstrap();
