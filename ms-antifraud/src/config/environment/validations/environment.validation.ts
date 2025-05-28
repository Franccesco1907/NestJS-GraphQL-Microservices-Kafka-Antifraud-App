import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsInt()
  @Type(() => Number)
  API_PORT: number;

  @IsInt()
  @Type(() => Number)
  TIMEOUT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsInt()
  @Type(() => Number)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  CORS_ORIGINS: string;

  @IsString()
  CORS_METHODS: string;

  @IsString()
  CORS_ALLOWED_HEADERS: string;

  @IsString()
  CORS_EXPOSED_HEADERS: string;

  @IsString()
  CORS_CREDENTIALS: string;

  @IsString()
  TRANSACTION_KAFKA_NAME: string;

  @IsString()
  TRANSACTION_KAFKA_HOST: string;

  @IsInt()
  @Type(() => Number)
  TRANSACTION_KAFKA_PORT: number;

  @IsString()
  TRANSACTION_KAFKA_CLIENT_ID: string;

  @IsString()
  TRANSACTION_KAFKA_GROUP_ID: string;

  @IsString()
  ANTIFRAUD_KAFKA_NAME: string;

  @IsString()
  ANTIFRAUD_KAFKA_HOST: string;

  @IsInt()
  @Type(() => Number)
  ANTIFRAUD_KAFKA_PORT: number;

  @IsString()
  ANTIFRAUD_KAFKA_CLIENT_ID: string;

  @IsString()
  ANTIFRAUD_KAFKA_GROUP_ID: string;
}
