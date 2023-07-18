import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ErrorStatusMapper } from '../error-status-mapper.util';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let message;
    let status;
    try {
      const mapper = new ErrorStatusMapper();
      status = mapper.grpcToHttpMapper(exception.code);
      message =
        exception.details ||
        JSON.parse(exception.message.split(':').slice(1).join(':')).message;
    } catch {
      console.log(exception)
      status = exception.getStatus();
      message = exception.response?.message || exception.message;
    }
    const type = HttpStatus[status];
    response.status(status).send({
      statusCode: status,
      message,
      error: type,
    });
  }
}
