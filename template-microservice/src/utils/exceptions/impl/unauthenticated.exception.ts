import { Status } from '@grpc/grpc-js/build/src/constants';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const UNAUTHENTICATED: IError = {
  code: Status.UNAUTHENTICATED,
  message: 'Unauthenticated',
};

export const TOKEN_INVALID: IError = {
  code: Status.INVALID_ARGUMENT,
  message: 'Token invalid',
};

export const TOKEN_EXPIRED: IError = {
  code: Status.INVALID_ARGUMENT,
  message: 'Token expired',
};

export const AUTH_CREDENTIALS_INVALID: IError = {
  code: Status.INVALID_ARGUMENT,
  message: 'Auth credentials invalid',
};

export class UnauthenticatedException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(
      typeof customCode === 'string'
        ? { code: Status.UNAUTHENTICATED, message: customCode }
        : customCode || UNAUTHENTICATED,
      metadata,
    );
  }
}
