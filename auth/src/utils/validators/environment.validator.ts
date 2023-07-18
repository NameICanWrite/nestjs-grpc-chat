import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateIf, validateSync } from 'class-validator';
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

  @IsEnum(LogLevel, {
    message: `LOG_LEVEL must be one of: [${Object.values(LogLevel)}]`,
  })
  LOG_LEVEL: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.PRODUCTION)
  @IsNotEmpty()
  LOG_FILE: string;

  // CRM PARAMS

  @IsNotEmpty()
  CRM_OAUTH_HOST: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.DEVELOPMENT)
  @IsNotEmpty()
  CRM_OAUTH_CLIENT_ID_LOCAL: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.DEVELOPMENT)
  @IsNotEmpty()
  CRM_OAUTH_CLIENT_SECRET_LOCAL: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.DEVELOPMENT)
  @IsNotEmpty()
  CRM_OAUTH_CLIENT_ID_DEV: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.DEVELOPMENT)
  @IsNotEmpty()
  CRM_OAUTH_CLIENT_SECRET_DEV: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.PRODUCTION)
  @IsNotEmpty()
  CRM_OAUTH_CLIENT_ID_PROD: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.PRODUCTION)
  @IsNotEmpty()
  CRM_OAUTH_CLIENT_SECRET_PROD: string;

  @IsNotEmpty()
  JWT_SECRET: string;
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
