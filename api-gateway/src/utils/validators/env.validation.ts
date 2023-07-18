import { plainToInstance } from 'class-transformer';
import {
  Allow,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';

const logger = new Logger('env.validation');

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Verbose = 'verbose',
}

class EnvironmentVariables {
  @IsNotEmpty()
  @IsEnum(Environment, {
    message: `NODE_ENV must be one of ${Object.values(Environment).join(', ')}`,
  })
  public NODE_ENV: Environment;

  @Allow()
  HOST: string;

  @Allow()
  PORT: string;

  @IsNotEmpty()
  REDIS_HOST: string;

  @Allow()
  REDIS_PORT: string;

  @IsNumber()
  @Min(1)
  THROTTLE_TTL: number;

  @IsNumber()
  @Min(1)
  THROTTLE_LIMIT: number;

  @IsEnum(LogLevel, {
    message: `LOG_LEVEL must be one of: [${Object.values(LogLevel)}]`,
  })
  LOG_LEVEL: string;

  @IsNotEmpty()
  LOG_FILE: string;

  @IsNotEmpty()
  GRPC_AUTH_SERVICE_HOST: string;

  @IsNotEmpty()
  GRPC_USER_SERVICE_HOST: string;

  @IsNotEmpty()
  GRPC_CHAT_SERVICE_HOST: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    logger.error(errors.toString(), {
      ...errors.map(
        (error, _index) =>
          `${Object.values(error.constraints)} | value: ${error.value}`,
      ),
    });
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
