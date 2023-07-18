import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'node:path';
import { COMMON_PACKAGE_NAME } from '../src/common.pb';
import { HEALTH_CHECK_PACKAGE_NAME } from '../src/health-check/health-check.pb';
import {
  HISTORY_PACKAGE_NAME,
  USER_HISTORY_SERVICE_NAME,
} from '../src/history/history.pb';
import {
  RESULT_PACKAGE_NAME,
  USER_RESULT_SERVICE_NAME,
} from '../src/result/result.pb';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '../src/user-module/user.pb';
import {
  USER_VERIFICATION_SERVICE_NAME,
  VERIFICATION_PACKAGE_NAME,
} from '../src/verification/verification.pb';

export const userUrl = '0.0.0.0:50100';

export const resultUrl = '0.0.0.0:50101';

export const historyUrl = '0.0.0.0:50102';

export const verificationUrl = '0.0.0.0:50103';

export const clientLoader = {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
};

export const grpcUserOptions = {
  name: USER_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: userUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      USER_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/user.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcUserClientOptions = {
  name: USER_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: userUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      USER_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/user.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;

export const grpcResultOptions = {
  name: USER_RESULT_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: resultUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      RESULT_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/result.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcResultClientOptions = {
  name: USER_RESULT_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: resultUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      RESULT_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/result.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;

export const grpcHistoryOptions = {
  name: USER_HISTORY_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: historyUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      HISTORY_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/history.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcHistoryClientOptions = {
  name: USER_HISTORY_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: historyUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      HISTORY_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/history.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;

export const grpcVerificationOptions = {
  name: USER_VERIFICATION_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: verificationUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      VERIFICATION_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/verification.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcVerificationClientOptions = {
  name: USER_VERIFICATION_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: verificationUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      VERIFICATION_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/user.common.proto'),
      resolve(__dirname, '../src/_proto/verification.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;
