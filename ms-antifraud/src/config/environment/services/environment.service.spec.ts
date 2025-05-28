import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from './environment.service';
import { ConfigService } from '@nestjs/config';

describe('EnvironmentService', () => {
  let service: EnvironmentService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'API_PORT':
                  return 3000;
                case 'NODE_ENV':
                  return 'development';
                case 'TIMEOUT':
                  return '5000';
                case 'CORS_ORIGINS':
                  return 'http://localhost:3000,http://example.com';
                case 'CORS_METHODS':
                  return 'GET,HEAD,PUT,PATCH,POST,DELETE';
                case 'CORS_ALLOWED_HEADERS':
                  return 'Content-Type,Authorization';
                case 'CORS_EXPOSED_HEADERS':
                  return 'Content-Length';
                case 'CORS_CREDENTIALS':
                  return true;
                case 'TRANSACTION_KAFKA_NAME':
                  return 'TRANSACTION_SERVICE';
                case 'TRANSACTION_KAFKA_HOST':
                  return 'kafka';
                case 'TRANSACTION_KAFKA_PORT':
                  return 29092;
                case 'TRANSACTION_KAFKA_CLIENT_ID':
                  return 'transaction';
                case 'TRANSACTION_KAFKA_GROUP_ID':
                  return 'transaction-consumer';
                case 'ANTIFRAUD_KAFKA_NAME':
                  return 'ANTIFRAUD_SERVICE';
                case 'ANTIFRAUD_KAFKA_HOST':
                  return 'kafka';
                case 'ANTIFRAUD_KAFKA_PORT':
                  return 29092;
                case 'ANTIFRAUD_KAFKA_CLIENT_ID':
                  return 'antifraud';
                case 'ANTIFRAUD_KAFKA_GROUP_ID':
                  return 'antifraud-consumer';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EnvironmentService>(EnvironmentService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get apiPort', () => {
    expect(service.apiPort).toBe(3000);
    expect(configService.get).toHaveBeenCalledWith('API_PORT');
  });

  it('should get environment', () => {
    expect(service.environment).toBe('development');
    expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
  });

  it('should get timeout', () => {
    expect(service.timeout).toBe(5000);
    expect(configService.get).toHaveBeenCalledWith('TIMEOUT');
  });

  describe('cors', () => {
    it('should get cors configuration with multiple origins', () => {
      const expectedCorsConfig = {
        origin: ['http://localhost:3000', 'http://example.com'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        exposedHeaders: 'Content-Length',
        credentials: true,
      };
      expect(service.cors).toEqual(expectedCorsConfig);
      expect(configService.get).toHaveBeenCalledWith('CORS_ORIGINS');
      expect(configService.get).toHaveBeenCalledWith('CORS_METHODS');
      expect(configService.get).toHaveBeenCalledWith('CORS_ALLOWED_HEADERS');
      expect(configService.get).toHaveBeenCalledWith('CORS_EXPOSED_HEADERS');
      expect(configService.get).toHaveBeenCalledWith('CORS_CREDENTIALS');
    });

    it('should handle empty CORS_ORIGINS', () => {
      (configService.get as jest.Mock).mockReturnValueOnce('');
      const expectedCorsConfig = {
        origin: [],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        exposedHeaders: 'Content-Length',
        credentials: true,
      };
      expect(service.cors).toEqual(expectedCorsConfig);
    });
  });

  describe('transactionKafka', () => {
    it('should get transaction Kafka configuration', () => {
      const expectedKafkaConfig = {
        host: 'kafka:29092',
        name: 'TRANSACTION_SERVICE',
        clientId: 'transaction',
        groupId: 'transaction-consumer',
      };
      expect(service.transactionKafka).toEqual(expectedKafkaConfig);
      expect(configService.get).toHaveBeenCalledWith('TRANSACTION_KAFKA_HOST');
      expect(configService.get).toHaveBeenCalledWith('TRANSACTION_KAFKA_PORT');
      expect(configService.get).toHaveBeenCalledWith('TRANSACTION_KAFKA_NAME');
      expect(configService.get).toHaveBeenCalledWith('TRANSACTION_KAFKA_CLIENT_ID');
      expect(configService.get).toHaveBeenCalledWith('TRANSACTION_KAFKA_GROUP_ID');
    });
  });

  describe('antifraudKafka', () => {
    it('should get antifraud Kafka configuration', () => {
      const expectedKafkaConfig = {
        host: 'kafka:29092',
        name: 'ANTIFRAUD_SERVICE',
        clientId: 'antifraud',
        groupId: 'antifraud-consumer',
      };
      expect(service.antifraudKafka).toEqual(expectedKafkaConfig);
      expect(configService.get).toHaveBeenCalledWith('ANTIFRAUD_KAFKA_HOST');
      expect(configService.get).toHaveBeenCalledWith('ANTIFRAUD_KAFKA_PORT');
      expect(configService.get).toHaveBeenCalledWith('ANTIFRAUD_KAFKA_NAME');
      expect(configService.get).toHaveBeenCalledWith('ANTIFRAUD_KAFKA_CLIENT_ID');
      expect(configService.get).toHaveBeenCalledWith('ANTIFRAUD_KAFKA_GROUP_ID');
    });
  });
});