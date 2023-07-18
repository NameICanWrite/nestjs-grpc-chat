import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';

import { IError } from './code.types';

export const UNAUTHENTICATED: IError = {
  code: status.UNAUTHENTICATED,
  message: 'Unauthenticated',
};

export const TOKEN_INVALID: IError = {
  code: status.UNAUTHENTICATED,
  message: 'Token invalid',
};

export const TOKEN_EXPIRED: IError = {
  code: status.UNAUTHENTICATED,
  message: 'Token expired',
};

export const AUTH_CREDENTIALS_INVALID: IError = {
  code: status.INVALID_ARGUMENT,
  message: 'Auth credentials invalid',
};

export class UnauthenticatedException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || UNAUTHENTICATED, metadata);
  }
}
