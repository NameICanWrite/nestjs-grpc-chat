import { status } from '@grpc/grpc-js';

export interface IError {
  code: status;
  message: string;
}
