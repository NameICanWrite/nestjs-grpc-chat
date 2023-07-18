import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';

import { IError } from './code.types';

export const INVALID_ARGUMENT: IError = {
  code: status.INVALID_ARGUMENT,
  message: 'Invalid argument',
};

export class InvalidArgumentException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || INVALID_ARGUMENT, metadata);
  }
}
