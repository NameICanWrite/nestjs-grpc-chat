import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';

import { IError } from './code.types';

export const ALREADY_EXIST: IError = {
  code: status.ALREADY_EXISTS,
  message: 'Resource already exists',
};

export class AlreadyExistsException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || ALREADY_EXIST, metadata);
  }
}
