import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';

import { IError } from './code.types';

export const UNAVAILABLE: IError = {
  code: status.UNAVAILABLE,
  message: 'Resource unavailable',
};

export class UnavailableException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || UNAVAILABLE, metadata);
  }
}
