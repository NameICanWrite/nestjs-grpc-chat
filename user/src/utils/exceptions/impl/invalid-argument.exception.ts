import { Status } from '@grpc/grpc-js/build/src/constants';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const INVALID_ARGUMENT: IError = {
  code: Status.INVALID_ARGUMENT,
  message: 'Invalid argument',
};

export class InvalidArgumentException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(
      typeof customCode === 'string'
        ? { code: Status.INVALID_ARGUMENT, message: customCode }
        : customCode || INVALID_ARGUMENT,
      metadata,
    );
  }
}
