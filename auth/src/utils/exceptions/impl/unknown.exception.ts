import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const UNKNOWN: IError = {
  code: status.UNKNOWN,
  message: '',
};

export class UnknownException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || UNKNOWN, metadata);
  }
}
