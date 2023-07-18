import { status } from '@grpc/grpc-js';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';

import { IError } from './code.types';

export const PERMISSION_DENIED: IError = {
  code: status.PERMISSION_DENIED,
  message: 'Permission denied',
};

export class PermissionDeniedException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(customCode || PERMISSION_DENIED, metadata);
  }
}
