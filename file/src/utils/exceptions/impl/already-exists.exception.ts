import { Status } from '@grpc/grpc-js/build/src/constants';
import { BaseException, ErrorCodeType, MetadataType } from './base.exception';
import { IError } from './code.types';

export const ALREADY_EXIST: IError = {
  code: Status.ALREADY_EXISTS,
  message: 'Resource already exists',
};

export const ROLE_ALREADY_EXIST: IError = {
  code: Status.ALREADY_EXISTS,
  message: 'Role already exists',
};

export class AlreadyExistsException extends BaseException {
  constructor(customCode?: ErrorCodeType, metadata: MetadataType = {}) {
    super(
      typeof customCode === 'string'
        ? { code: Status.ALREADY_EXISTS, message: customCode }
        : customCode || ALREADY_EXIST,
      metadata,
    );
  }
}
