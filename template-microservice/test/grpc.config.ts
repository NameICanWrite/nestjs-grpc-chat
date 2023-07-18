import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'node:path';
import { COMMON_PACKAGE_NAME } from '../src/common.pb';
import { HEALTH_CHECK_PACKAGE_NAME } from '../src/health-check/health-check.pb';
import {
  HISTORY_PACKAGE_NAME,
  TASK_HISTORY_SERVICE_NAME,
} from '../src/history/history.pb';
import {
  RESULT_PACKAGE_NAME,
  TASK_RESULT_SERVICE_NAME,
} from '../src/result/result.pb';
import { TASK_PACKAGE_NAME, TASK_SERVICE_NAME } from '../src/template-module/template.pb';
import {
  TASK_VERIFICATION_SERVICE_NAME,
  VERIFICATION_PACKAGE_NAME,
} from '../src/verification/verification.pb';

export const taskUrl = '0.0.0.0:50100';

export const resultUrl = '0.0.0.0:50101';

export const historyUrl = '0.0.0.0:50102';

export const verificationUrl = '0.0.0.0:50103';

export const clientLoader = {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
};

export const grpcTaskOptions = {
  name: TASK_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: taskUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      TASK_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/task.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcTaskClientOptions = {
  name: TASK_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: taskUrl,
    package: [
      HEALTH_CHECK_PACKAGE_NAME,
      COMMON_PACKAGE_NAME,
      TASK_PACKAGE_NAME,
    ],
    protoPath: [
      resolve(__dirname, '../src/_proto/health-check.proto'),
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/task.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;

export const grpcResultOptions = {
  name: TASK_RESULT_SERVICE_NAME,
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
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/result.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcResultClientOptions = {
  name: TASK_RESULT_SERVICE_NAME,
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
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/result.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;

export const grpcHistoryOptions = {
  name: TASK_HISTORY_SERVICE_NAME,
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
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/history.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcHistoryClientOptions = {
  name: TASK_HISTORY_SERVICE_NAME,
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
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/history.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;

export const grpcVerificationOptions = {
  name: TASK_VERIFICATION_SERVICE_NAME,
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
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/verification.proto'),
    ],
    loader: {
      enums: String,
    },
  },
} as ClientProviderOptions;

export const grpcVerificationClientOptions = {
  name: TASK_VERIFICATION_SERVICE_NAME,
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
      resolve(__dirname, '../src/_proto/common.proto'),
      resolve(__dirname, '../src/_proto/verification.proto'),
    ],
    loader: clientLoader,
  },
} as ClientProviderOptions;
