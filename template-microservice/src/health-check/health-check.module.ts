import { Module } from '@nestjs/common';

import { HealthController } from './health-check.controller';

@Module({
  controllers: [HealthController],
})
export class HealthCheckModule {}
