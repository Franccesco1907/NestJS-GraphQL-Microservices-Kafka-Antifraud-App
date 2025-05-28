import { TransactionRepository } from '@modules/transaction/infrastructure/repositories';
import { TransactionEntity } from '@modules/transaction/domain/entities';
import { TransformedTransaction } from '@modules/transaction/infrastructure/dto';
import { TransactionMapper } from '@modules/transaction/infrastructure/mappers/transaction.mapper';
import { FindAllTransactionUseCase } from './find-all-transaction.use-case';

jest.mock('@modules/transaction/infrastructure/mappers/transaction.mapper');

describe('FindAllTransactionUseCase', () => {
  let useCase: FindAllTransactionUseCase;
  let repository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    repository = {
      findEntities: jest.fn(),
    } as any;

    useCase = new FindAllTransactionUseCase(repository);
  });

  it('should return transformed transactions', async () => {
    const mockEntities: TransactionEntity[] = [
      { id: '1', value: 100 } as TransactionEntity,
      { id: '2', value: 200 } as TransactionEntity,
    ];

    const mockTransformed: TransformedTransaction[] = [
      { transactionExternalId: '1', transactionType: { name: "Tipo de transacción" }, transactionStatus: { name: 'PENDING' }, value: 100, createdAt: new Date().toISOString() },
      { transactionExternalId: '2', transactionType: { name: "Tipo de transacción" }, transactionStatus: { name: 'PENDING' }, value: 200, createdAt: new Date().toISOString() },
    ];

    repository.findEntities.mockResolvedValue(mockEntities);
    (TransactionMapper.toTransactionTransformed as jest.Mock).mockImplementation((entity: TransactionEntity) => {
      return mockTransformed.find(t => t.transactionExternalId === entity.id)!;
    });

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    const result = await useCase.execute();

    expect(repository.findEntities).toHaveBeenCalledWith({});
    expect(TransactionMapper.toTransactionTransformed).toHaveBeenCalledTimes(mockEntities.length);
    expect(consoleLogSpy).toHaveBeenCalledWith('FindAllTransactionUseCase executed, found entities:', mockEntities);
    expect(consoleLogSpy).toHaveBeenCalledWith('Transformed transactions:', mockTransformed);
    expect(result).toEqual(mockTransformed);

    consoleLogSpy.mockRestore();
  });
});
