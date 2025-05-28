import { TransactionStatusEnum } from '@common/enums/transaction';
import { UPDATE_TRANSACTION_USE_CASE, UpdateTransactionUseCaseInterface } from '@modules/transaction/domain/ports/in';
import { Test, TestingModule } from '@nestjs/testing';
import { AntifraudResponseDto } from '../dto';
import { TransactionController } from './transaction.controller';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockUpdateTransactionUseCase: jest.Mocked<UpdateTransactionUseCaseInterface>;

  beforeEach(async () => {
    mockUpdateTransactionUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: UPDATE_TRANSACTION_USE_CASE,
          useValue: mockUpdateTransactionUseCase,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle transaction update and call use case with correct parameters', async () => {
    const transaction: AntifraudResponseDto = {
      id: 'txn-123',
      value: 1000,
      transactionStatus: TransactionStatusEnum.APPROVED,
    };

    const expectedResult = {
      transactionExternalId: 'txn-123',
      transactionType: { name: 'Tipo de transacción' },
      transactionStatus: { name: TransactionStatusEnum.APPROVED.toString() },
      value: 1000,
      createdAt: new Date().toISOString(),
    };

    mockUpdateTransactionUseCase.execute.mockResolvedValue(expectedResult);

    const result = await controller.handleTransactionUpdate(transaction);

    expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith('txn-123', {
      transactionStatus: TransactionStatusEnum.APPROVED,
    });
    expect(result).toEqual(expectedResult);
  });
});
