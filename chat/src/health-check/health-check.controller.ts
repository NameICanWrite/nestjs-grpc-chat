import { GrpcMethod } from '@nestjs/microservices';
import { Controller, Logger, UseFilters } from '@nestjs/common';
import {
  HealthController as HealthControllerInterface,
  HealthCheckResponse,
  HealthCheckResponse_ServingStatus,
  Stub,
  HealthControllerMethods,
  HEALTH_SERVICE_NAME,
} from '../_proto/health-check.pb';
import { RpcExceptionFilter } from '../utils/exceptions';

@HealthControllerMethods()
@Controller()
export class HealthController implements HealthControllerInterface {
  private readonly logger = new Logger(HealthController.name);

  @GrpcMethod(HEALTH_SERVICE_NAME, 'check')
  @UseFilters(RpcExceptionFilter.for('HealthController::check'))
  check(_data: Stub): HealthCheckResponse {
    this.logger.debug('HealthController::check');
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }
}
