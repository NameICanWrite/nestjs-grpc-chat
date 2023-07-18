/* eslint-disable @typescript-eslint/naming-convention */
import { plainToInstance } from 'class-transformer';
import {
  Allow,
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';

const logger = new Logger('env.validation');

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
}

class EnvironmentVariables {
  @IsNotEmpty()
  @IsEnum(Environment, {
    message: `NODE_ENV must be one of ${Object.values(Environment).join(', ')}`,
  })
  public NODE_ENV: Environment;

  @IsNotEmpty()
  DATABASE_TYPE: string;

  @IsNotEmpty()
  DATABASE_HOST: string;

  @Allow()
  DATABASE_PORT: string;

  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsNotEmpty()
  DATABASE_SYNCHRONIZE: string;

  @IsNotEmpty()
  DATABASE_LOGGING: string;

  @IsNotEmpty()
  DATABASE_MAX_CONNECTIONS: string;

  @IsBooleanString()
  DATABASE_SSL_ENABLED: string;

  // Optional
  @ValidateIf((o) => o.DATABASE_SSL_ENABLED === 'true')
  @IsBooleanString()
  DATABASE_REJECT_UNAUTHORIZED: string;

  @ValidateIf((o) => o.DATABASE_SSL_ENABLED === 'true')
  @IsNotEmpty()
  DATABASE_CA: string;

  @ValidateIf((o) => o.DATABASE_SSL_ENABLED === 'true')
  @IsNotEmpty()
  DATABASE_KEY: string;

  @ValidateIf((o) => o.DATABASE_SSL_ENABLED === 'true')
  @IsNotEmpty()
  DATABASE_CERT: string;

  @IsEnum(LogLevel, {
    message: `LOG_LEVEL must be one of: [${Object.values(LogLevel)}]`,
  })
  LOG_LEVEL: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.PRODUCTION)
  @IsNotEmpty()
  LOG_FILE: string;
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
        (error) =>
          `${Object.values(error.constraints)} | value: ${error.value}`,
      ),
    });
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
