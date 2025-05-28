import { TransactionRepository } from '@modules/transaction/infrastructure/repositories/transaction.repository';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionEntity } from '@modules/transaction/domain/entities';
import { CreateTransactionInput } from '@modules/transaction/infrastructure/dto';
import { CreateTransactionUseCase } from './create-transaction.use-case';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let repository: jest.Mocked<TransactionRepository>;
  let kafkaClient: jest.Mocked<ClientKafka>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    kafkaClient = {
      emit: jest.fn(),
    } as any;

    useCase = new CreateTransactionUseCase(repository, kafkaClient);
  });

  const input: CreateTransactionInput = {
    accountExternalIdCredit: 'account-1234',
    accountExternalIdDebit: 'account-5678',
    tranferTypeId: 1,
    value: 100,
  };

  const transaction: TransactionEntity = {
    id: 'uuid-1234',
    value: 100,
  } as TransactionEntity;

  it('should create and save a transaction and emit event', async () => {
    repository.create.mockReturnValue(transaction);
    repository.save.mockResolvedValue(transaction);

    const result = await useCase.execute(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(repository.save).toHaveBeenCalledWith(transaction);
    expect(kafkaClient.emit).toHaveBeenCalledWith(
      'transaction.created',
      JSON.stringify({
        id: transaction.id,
        value: transaction.value,
      })
    );
    expect(result).toBe(transaction);
  });

  it('should handle error when emitting event', async () => {
    repository.create.mockReturnValue(transaction);
    repository.save.mockResolvedValue(transaction);
    kafkaClient.emit.mockImplementation(() => {
      throw new Error('Kafka error');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    const result = await useCase.execute(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(repository.save).toHaveBeenCalledWith(transaction);
    expect(kafkaClient.emit).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error emitting transaction created event:',
      expect.any(Error)
    );
    expect(result).toBe(transaction);

    consoleErrorSpy.mockRestore();
  });
});
