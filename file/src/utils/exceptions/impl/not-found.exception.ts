import { Status } from '@grpc/grpc-js/build/src/constants';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const NOT_FOUND: IError = {
  code: Status.NOT_FOUND,
  message: 'Not found',
};

export const USER_NOT_FOUND: IError = {
  code: Status.NOT_FOUND,
  message: 'User not found',
};

export const ROLE_NOT_FOUND: IError = {
  code: Status.NOT_FOUND,
  message: 'Role not found',
};

export const DEFAULT_ROLE_NOT_FOUND: IError = {
  code: Status.NOT_FOUND,
  message: 'Default Role not found',
};

export class NotFoundException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(
      typeof customCode === 'string'
        ? { code: Status.NOT_FOUND, message: customCode }
        : customCode || NOT_FOUND,
      metadata,
    );
  }
}
