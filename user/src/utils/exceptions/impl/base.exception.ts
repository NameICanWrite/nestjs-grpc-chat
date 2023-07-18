import { RpcException } from '@nestjs/microservices';

interface IErrorCode {
  code: number;
  message: string;
}

export type ErrorCodeType = IErrorCode | null | string;

export interface MetadataType {
  [key: string]: string;
}

export class BaseException extends RpcException {
  constructor(errorCode: IErrorCode, metadata: MetadataType) {
    super({
      code: errorCode.code,

      message: JSON.stringify({
        message: errorCode.message,
        metadata,
      }),
    });
  }
}
