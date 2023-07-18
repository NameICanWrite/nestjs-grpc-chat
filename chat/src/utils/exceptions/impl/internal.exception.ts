import { Status } from '@grpc/grpc-js/build/src/constants';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const INTERNAL_ERROR: IError = {
  code: Status.INTERNAL,
  message: 'Internal error',
};

export class InternalException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(
      typeof customCode === 'string'
        ? { code: Status.INTERNAL, message: customCode }
        : customCode || INTERNAL_ERROR,
      metadata,
    );
  }
}
