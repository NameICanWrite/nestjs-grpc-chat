import { Logger } from '@nestjs/common';
import { IExceptionHandler } from '../interfaces';

import { BaseException } from '../../../impl/base.exception';
import { InternalException } from '../../../impl';

export class InternalExceptionHandler implements IExceptionHandler {
  private readonly logger = new Logger('InternalExceptionHandler');

  constructor(
    private readonly exception: Error,
    private readonly label: string,
  ) {}

  public wrapError(): BaseException {
    return new InternalException();
  }

  public warnAboutError(): void {
    const { stack, message } = this.exception;
    this.logger.error(
      `${this.label} :: Internal error "${message}",\nStack: ${stack}`,
    );
  }
}
