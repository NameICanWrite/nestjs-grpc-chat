import { Status } from '@grpc/grpc-js/build/src/constants';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const PERMISSION_DENIED: IError = {
  code: Status.PERMISSION_DENIED,
  message: 'Permission denied',
};

export class PermissionDeniedException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(
      typeof customCode === 'string'
        ? { code: Status.PERMISSION_DENIED, message: customCode }
        : customCode || PERMISSION_DENIED,
      metadata,
    );
  }
}
