import { Logger } from '@nestjs/common';
import { IExceptionHandler } from '../interfaces';

import { BaseException } from '../../../impl/base.exception';

export class RpcExceptionHandler implements IExceptionHandler {
  private readonly logger = new Logger('RpcExceptionHandler');

  constructor(private readonly exception: BaseException) {}

  public wrapError(): BaseException {
    // not need to handle this error,
    // because it regular exception from backend services
    return this.exception;
  }

  public warnAboutError(): void {
    const { message }: any = this.exception;
    this.logger.debug(`Internal exception: ${message}`);
  }
}
