import { TransactionEntity } from '@modules/transaction/domain/entities';
import { TransformedTransaction } from '@modules/transaction/infrastructure/dto/responses/transformed-transaction-response.dto';
import { TransactionMapper } from '@modules/transaction/infrastructure/mappers/transaction.mapper';
import { TransactionRepository } from '@modules/transaction/infrastructure/repositories/transaction.repository';
import { NotFoundException } from '@nestjs/common';
import { FindOneTransactionUseCase } from './find-one-transaction.use-case';

jest.mock('@modules/transaction/infrastructure/mappers/transaction.mapper');

describe('FindOneTransactionUseCase', () => {
  let useCase: FindOneTransactionUseCase;
  let repository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = {
      findOneBy: jest.fn(),
    } as any;

    useCase = new FindOneTransactionUseCase(repository);
  });

  it('should return transformed transaction when found', async () => {
    const mockEntity: TransactionEntity = {
      id: '123',
      value: 500,
      transactionStatus: 0,
      createdAt: new Date(),
    } as TransactionEntity;

    const mockTransformed: TransformedTransaction = {
      transactionExternalId: '123',
      transactionType: { name: 'Tipo de transacción' },
      transactionStatus: { name: 'PENDING' },
      value: 500,
      createdAt: mockEntity.createdAt.toISOString(),
    };

    repository.findOneBy.mockResolvedValue(mockEntity);
    (TransactionMapper.toTransactionTransformed as jest.Mock).mockReturnValue(mockTransformed);

    const result = await useCase.execute('123');

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: '123' });
    expect(TransactionMapper.toTransactionTransformed).toHaveBeenCalledWith(mockEntity);
    expect(result).toEqual(mockTransformed);
  });

  it('should throw NotFoundException if transaction not found', async () => {
    const id = '999';

    repository.findOneBy.mockResolvedValue(null);

    await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
    expect(TransactionMapper.toTransactionTransformed).not.toHaveBeenCalled();
  });
});
