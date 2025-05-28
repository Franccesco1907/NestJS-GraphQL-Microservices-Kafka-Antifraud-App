// src/modules/antifraud/application/use-cases/verify-antifraud/verify-antifraud.use-case.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { VerifyAntifraudUseCase } from './verify-antifraud.use-case';
import { TransactionNotifierPortInterface } from '@modules/antifraud/domain/ports';
import { TransactionDto } from '@modules/antifraud/infrastructure/dto';
import { TransactionMapper } from '@modules/antifraud/infrastructure/mappers';
import { TransactionEntity } from '@modules/antifraud/domain/entities';

describe('VerifyAntifraudUseCase', () => {
  let useCase: VerifyAntifraudUseCase;
  let mockTransactionNotifier: jest.Mocked<TransactionNotifierPortInterface>;

  beforeEach(async () => {
    mockTransactionNotifier = {
      notifyTransactionUpdate: jest.fn(),
    } as jest.Mocked<TransactionNotifierPortInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyAntifraudUseCase,
        {
          provide: TransactionNotifierPortInterface,
          useValue: mockTransactionNotifier,
        },
      ],
    }).compile();

    useCase = module.get<VerifyAntifraudUseCase>(VerifyAntifraudUseCase);

    jest.spyOn(TransactionMapper, 'toTransactionEntity').mockReturnValue({
      id: 'uuid-dto-123',
      transactionStatus: 1,
      value: 100,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should map the transaction DTO to a domain entity and notify the antifraud service', async () => {
    const mockTransactionDto: TransactionDto = {
      id: 'uuid-dto-123',
      transactionStatus: 1,
      value: 100,
    };

    const mockDomainTransaction: TransactionEntity = {
      id: 'uuid-dto-123',
      transactionStatus: 1,
      value: 100,
    };

    await useCase.execute(mockTransactionDto);

    expect(mockTransactionNotifier.notifyTransactionUpdate).toHaveBeenCalledTimes(1);
    expect(mockTransactionNotifier.notifyTransactionUpdate).toHaveBeenCalledWith(mockDomainTransaction);
  });
});