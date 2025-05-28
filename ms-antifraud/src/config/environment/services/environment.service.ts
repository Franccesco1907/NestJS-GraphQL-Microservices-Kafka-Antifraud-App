import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorsConfig, KafkaConfig } from '../interfaces';

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) { }

  get apiPort(): number {
    return this.configService.get<number>('API_PORT')!;
  }

  get environment(): string {
    return this.configService.get<string>('NODE_ENV')!;
  }

  get timeout(): number {
    return +this.configService.get<number>('TIMEOUT')!;
  }

  get cors(): CorsConfig {
    const originArray = this.configService
      .get<string>('CORS_ORIGINS')!
      .split(',')
      .filter((origin) => origin.trim() !== '');
    return {
      origin: originArray,
      methods: this.configService.get<string>('CORS_METHODS')!,
      allowedHeaders: this.configService.get<string>('CORS_ALLOWED_HEADERS')!,
      exposedHeaders: this.configService.get<string>('CORS_EXPOSED_HEADERS')!,
      credentials: this.configService.get<boolean>('CORS_CREDENTIALS')!,
    };
  }

  get transactionKafka(): KafkaConfig {
    return {
      host: `${this.configService.get<string>('TRANSACTION_KAFKA_HOST')}:${this.configService.get<number>('TRANSACTION_KAFKA_PORT')}`,
      name: this.configService.get<string>('TRANSACTION_KAFKA_NAME')!,
      clientId: this.configService.get<string>('TRANSACTION_KAFKA_CLIENT_ID')!,
      groupId: this.configService.get<string>('TRANSACTION_KAFKA_GROUP_ID')!,
    };
  }

  get antifraudKafka(): KafkaConfig {
    return {
      host: `${this.configService.get<string>('ANTIFRAUD_KAFKA_HOST')}:${this.configService.get<number>('ANTIFRAUD_KAFKA_PORT')}`,
      name: this.configService.get<string>('ANTIFRAUD_KAFKA_NAME')!,
      clientId: this.configService.get<string>('ANTIFRAUD_KAFKA_CLIENT_ID')!,
      groupId: this.configService.get<string>('ANTIFRAUD_KAFKA_GROUP_ID')!,
    };
  }
}
