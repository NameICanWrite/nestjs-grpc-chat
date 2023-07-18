import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';

import { IError } from './code.types';

export const INTERNAL_ERROR: IError = {
  code: status.INTERNAL,
  message: 'Internal error',
};

export class InternalException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || INTERNAL_ERROR, metadata);
  }
}
