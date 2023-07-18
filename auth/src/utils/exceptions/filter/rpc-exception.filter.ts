import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { ExceptionType, EXCEPTION_LIST } from './types';
import { IExceptionHandlerFactory } from './handlers/interfaces';
import { ExceptionHandlerFactory } from './handlers/exception-handler.factory';

@Catch(...EXCEPTION_LIST)
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly exceptionHandlerFactory: IExceptionHandlerFactory;

  public static for(label: string): RpcExceptionFilter {
    return new RpcExceptionFilter(label);
  }

  protected constructor(protected readonly label: string) {
    super();

    this.exceptionHandlerFactory = new ExceptionHandlerFactory(this.label);
  }

  public catch(exception: ExceptionType, host: ArgumentsHost): Observable<any> {
    const handler = this.exceptionHandlerFactory.getHandler(exception);

    handler.warnAboutError();

    return super.catch(handler.wrapError(), host as any);
  }
}
