import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { keysToCamel } from '../keys-to-camel.util';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformResponseFirmwareInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          ...data,
          data: keysToCamel(data.data),
        };
      }),
    );
  }
}
