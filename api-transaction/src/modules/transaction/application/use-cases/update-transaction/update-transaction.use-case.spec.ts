import { UpdateTransactionUseCase } from './update-transaction.use-case';
import { TransactionRepository } from '@modules/transaction/infrastructure/repositories/transaction.repository';
import { TransactionEntity } from '@modules/transaction/domain/entities/transaction.entity';
import { TransformedTransaction, UpdateTransactionInput } from '@modules/transaction/infrastructure/dto';
import { TransactionMapper } from '@modules/transaction/infrastructure/mappers/transaction.mapper';
import { NotFoundException } from '@nestjs/common';
import { FindOneTransactionUseCaseInterface } from '@modules/transaction/domain/ports/in';

jest.mock('@modules/transaction/infrastructure/mappers/transaction.mapper');

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let findOneTransactionUseCase: jest.Mocked<FindOneTransactionUseCaseInterface>;

  beforeEach(() => {
    jest.clearAllMocks();

    transactionRepository = {
      preload: jest.fn(),
      save: jest.fn(),
    } as any;

    findOneTransactionUseCase = {
      execute: jest.fn(),
    };

    useCase = new UpdateTransactionUseCase(transactionRepository, findOneTransactionUseCase);
  });

  it('should update and return transformed transaction', async () => {
    const id = '123';
    const input: UpdateTransactionInput = {
      value: 700,
      transactionStatus: 1,
    };

    const preloadedEntity: TransactionEntity = {
      id,
      value: input.value as number,
      transactionStatus: input.transactionStatus,
      createdAt: new Date(),
    } as TransactionEntity;

    const savedEntity: TransactionEntity = {
      ...preloadedEntity,
    } as TransactionEntity;

    const transformed: TransformedTransaction = {
      transactionExternalId: id,
      transactionType: { name: 'type' },
      transactionStatus: { name: 'APPROVED' },
      value: input.value as number,
      createdAt: preloadedEntity.createdAt.toISOString(),
    };

    findOneTransactionUseCase.execute.mockResolvedValue({} as TransformedTransaction);
    transactionRepository.preload.mockResolvedValue(preloadedEntity);
    transactionRepository.save.mockResolvedValue(savedEntity);
    (TransactionMapper.toTransactionTransformed as jest.Mock).mockReturnValue(transformed);

    const result = await useCase.execute(id, input);

    expect(findOneTransactionUseCase.execute).toHaveBeenCalledWith(id);
    expect(transactionRepository.preload).toHaveBeenCalledWith({ id, ...input });
    expect(transactionRepository.save).toHaveBeenCalledWith(preloadedEntity);
    expect(TransactionMapper.toTransactionTransformed).toHaveBeenCalledWith(savedEntity);
    expect(result).toEqual(transformed);
  });

  it('should throw NotFoundException if preload returns null', async () => {
    const id = '456';
    const input: UpdateTransactionInput = {
      value: 1000,
      transactionStatus: 2,
    };

    findOneTransactionUseCase.execute.mockResolvedValue({} as TransformedTransaction);
    transactionRepository.preload.mockResolvedValue(undefined);

    await expect(useCase.execute(id, input)).rejects.toThrow(NotFoundException);
    expect(transactionRepository.save).not.toHaveBeenCalled();
    expect(TransactionMapper.toTransactionTransformed).not.toHaveBeenCalled();
  });
});
