import { RpcException } from '@nestjs/microservices';

import { IExceptionHandler, IExceptionHandlerFactory } from './interfaces';

import { RpcExceptionHandler } from './impl/rpc-exception.handler';
import { InternalExceptionHandler } from './impl/internal-exception.handler';

import { ExceptionType } from '../types';

export class ExceptionHandlerFactory implements IExceptionHandlerFactory {
  constructor(private readonly label: string) {}

  public getHandler(exception: ExceptionType): IExceptionHandler {
    // handle regular exceptions from current microservices
    if (exception instanceof RpcException) {
      return new RpcExceptionHandler(exception);
    }

    // handle all other internal exceptions
    return new InternalExceptionHandler(exception, this.label);
  }
}
