import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';

import { IError } from './code.types';

export const NOT_FOUND: IError = {
  code: status.NOT_FOUND,
  message: 'Not found',
};

export const USER_NOT_FOUND: IError = {
  code: status.NOT_FOUND,
  message: 'User not found',
};

export class NotFoundException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || NOT_FOUND, metadata);
  }
}
