import { Status } from '@grpc/grpc-js/build/src/constants';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const UNAVAILABLE: IError = {
  code: Status.UNAVAILABLE,
  message: 'Resource unavailable',
};

export class UnavailableException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(
      typeof customCode === 'string'
        ? { code: Status.UNAVAILABLE, message: customCode }
        : customCode || UNAVAILABLE,
      metadata,
    );
  }
}
