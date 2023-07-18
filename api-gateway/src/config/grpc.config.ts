import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'node:path';
import { registerAs } from '@nestjs/config';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '../_proto/user.pb';
import { AUTH_PACKAGE_NAME, AUTHORIZATION_SERVICE_NAME } from '../_proto/auth.pb';
import { HEALTH_CHECK_PACKAGE_NAME } from 'src/_proto/health-check.pb';
import { CHAT_PACKAGE_NAME, CHAT_SERVICE_NAME } from 'src/_proto/chat.pb';
import { FILE_PACKAGE_NAME } from 'src/_proto/file.pb';

export default registerAs('grpc', () => ({
  grpcAuthOptions: {
    name: AUTHORIZATION_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_AUTH_SERVICE_HOST || '127.0.0.1:50051',
      package: [AUTH_PACKAGE_NAME, HEALTH_CHECK_PACKAGE_NAME],
      protoPath: [
        resolve(__dirname, '../_proto/auth.proto'),
        resolve(__dirname, '../_proto/health-check.proto'),
      ],
      loader: {
        keepCase: true,
        longs: String,
        defaults: true,
        oneofs: true,
      },
    },
  } as ClientProviderOptions,
  grpcUserOptions: {
    name: USER_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_USER_SERVICE_HOST || '127.0.0.1:50052',
      package: [
        HEALTH_CHECK_PACKAGE_NAME,
        USER_PACKAGE_NAME,
      ],
      protoPath: [
        resolve(__dirname, '../_proto/health-check.proto'),
        resolve(__dirname, '../_proto/user.proto'),
      ],
      loader: {
        keepCase: true,
        longs: String,
        defaults: true,
        oneofs: true,
      },
    },
  } as ClientProviderOptions,
  grpcChatOptions: {
    name: CHAT_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_CHAT_SERVICE_HOST || '127.0.0.1:50053',
      package: [
        HEALTH_CHECK_PACKAGE_NAME,
        CHAT_PACKAGE_NAME,
      ],
      protoPath: [
        resolve(__dirname, '../_proto/health-check.proto'),
        resolve(__dirname, '../_proto/chat.proto'),
      ],
      loader: {
        keepCase: true,
        longs: String,
        defaults: true,
        oneofs: true,
      },
    },
  } as ClientProviderOptions,
  grpcFileOptions: {
    name: CHAT_SERVICE_NAME,
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_FILE_SERVICE_HOST || '127.0.0.1:50054',
      package: [
        HEALTH_CHECK_PACKAGE_NAME,
        FILE_PACKAGE_NAME,
      ],
      protoPath: [
        resolve(__dirname, '../_proto/health-check.proto'),
        resolve(__dirname, '../_proto/file.proto'),
      ],
      loader: {
        keepCase: true,
        longs: String,
        defaults: true,
        oneofs: true,
      },
    },
  } as ClientProviderOptions
}))
