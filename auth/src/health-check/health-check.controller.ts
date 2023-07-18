import { GrpcMethod } from '@nestjs/microservices';
import { Controller, UseFilters } from '@nestjs/common';
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
  @GrpcMethod(HEALTH_SERVICE_NAME, 'check')
  @UseFilters(RpcExceptionFilter.for('HealthController::check'))
  check(_data: Stub): HealthCheckResponse {
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }
}
