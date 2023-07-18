import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';
import { AuthGuard } from '../auth/auth.guard';
import { RpcExceptionFilter } from '../utils/filters/grpc-exception.filter';

@ApiTags('healthCheck')
@UseFilters(new RpcExceptionFilter())
@Controller()
export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    schema: {
      example: {
        authHealth: {
          status: 'SERVING',
        },
        userHealth: {
          status: 'SERVING',
        },
        b24SyncHealth: {
          status: 'NOT_SERVING',
        },
      },
    },
    status: 200,
    description:
      'Health check statuses: 0 - UNKNOWN, 1 - SERVING, 2 - NOT_SERVING, -1 - UNRECOGNIZED',
  })
  @Get('/healthz')
  async healthCheck(): Promise<any> {
    return this.healthCheckService.check({});
  }
}
