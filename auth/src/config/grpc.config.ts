import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'node:path';
import { registerAs } from '@nestjs/config';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '../_proto/user.pb';

import { HEALTH_CHECK_PACKAGE_NAME } from '../_proto/health-check.pb';

export default registerAs('grpc', () => ({
 
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
}));
