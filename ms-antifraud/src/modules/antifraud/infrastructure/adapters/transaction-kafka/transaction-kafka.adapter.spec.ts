import { Test, TestingModule } from '@nestjs/testing';
import { TransactionKafkaAdapter } from './transaction-kafka.adapter';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionEntity } from '@modules/antifraud/domain/entities';

describe('TransactionKafkaAdapter', () => {
  let adapter: TransactionKafkaAdapter;
  let mockKafkaClient: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    mockKafkaClient = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<ClientKafka>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionKafkaAdapter,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    adapter = module.get<TransactionKafkaAdapter>(TransactionKafkaAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should emit transaction update event with the correct payload', async () => {
    const transaction: TransactionEntity = {
      id: 'uuid-123',
      value: 500,
      transactionStatus: 2,
    };

    await adapter.notifyTransactionUpdate(transaction);

    expect(mockKafkaClient.emit).toHaveBeenCalledTimes(1);
    expect(mockKafkaClient.emit).toHaveBeenCalledWith(
      'transaction.update',
      JSON.stringify(transaction),
    );
  });
});
