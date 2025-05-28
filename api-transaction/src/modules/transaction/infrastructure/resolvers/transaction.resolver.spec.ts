import { TransactionResolver } from './transaction.resolver';
import { CreateTransactionInput, UpdateTransactionInput, TransformedTransaction } from '../dto';
import { CreateTransactionUseCaseInterface, FindAllTransactionUseCaseInterface, FindOneTransactionUseCaseInterface, UpdateTransactionUseCaseInterface } from '@modules/transaction/domain/ports/in';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  let mockCreateTransactionUseCase: jest.Mocked<CreateTransactionUseCaseInterface>;
  let mockFindAllTransactionUseCase: jest.Mocked<FindAllTransactionUseCaseInterface>;
  let mockFindOneTransactionUseCase: jest.Mocked<FindOneTransactionUseCaseInterface>;
  let mockUpdateTransactionUseCase: jest.Mocked<UpdateTransactionUseCaseInterface>;

  beforeEach(() => {
    mockCreateTransactionUseCase = {
      execute: jest.fn(),
    };

    mockFindAllTransactionUseCase = {
      execute: jest.fn(),
    };

    mockFindOneTransactionUseCase = {
      execute: jest.fn(),
    };

    mockUpdateTransactionUseCase = {
      execute: jest.fn(),
    };

    resolver = new TransactionResolver(
      mockCreateTransactionUseCase,
      mockFindAllTransactionUseCase,
      mockFindOneTransactionUseCase,
      mockUpdateTransactionUseCase,
    );
  });

  describe('createTransaction', () => {
    it('should call createTransactionUseCase.execute with the correct input', async () => {
      const input: CreateTransactionInput = {
        accountExternalIdCredit: 'acc1',
        accountExternalIdDebit: 'acc2',
        tranferTypeId: 1,
        value: 100,
      };

      const mockEntity = {
        id: '123',
        accountExternalIdCredit: 'acc1',
        accountExternalIdDebit: 'acc2',
        tranferTypeId: 1,
        value: 100,
        transactionStatus: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockCreateTransactionUseCase.execute.mockResolvedValue(mockEntity as any);

      const result = await resolver.createTransaction(input);

      expect(mockCreateTransactionUseCase.execute).toHaveBeenCalledWith(input);
      expect(result).toBe(mockEntity);
    });
  });


  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions: TransformedTransaction[] = [
        {
          transactionExternalId: '1',
          transactionType: { name: 'Transfer' },
          transactionStatus: { name: 'Completed' },
          value: 200,
          createdAt: new Date().toISOString(),
        },
      ];

      mockFindAllTransactionUseCase.execute.mockResolvedValue(transactions);

      const result = await resolver.findAll();

      expect(mockFindAllTransactionUseCase.execute).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(transactions);
    });
  });

  describe('findOne', () => {
    it('should return a single transaction by id', async () => {
      const transaction: TransformedTransaction = {
        transactionExternalId: '1',
        transactionType: { name: 'Deposit' },
        transactionStatus: { name: 'Pending' },
        value: 500,
        createdAt: new Date().toISOString(),
      };

      mockFindOneTransactionUseCase.execute.mockResolvedValue(transaction);

      const result = await resolver.findOne('1');

      expect(mockFindOneTransactionUseCase.execute).toHaveBeenCalledWith('1');
      expect(result).toBe(transaction);
    });
  });

  describe('updateTransaction', () => {
    it('should call updateTransactionUseCase.execute with correct args', async () => {
      const id = '1';
      const input: UpdateTransactionInput = {
        transactionStatus: 2,
      };

      const updatedTransaction: TransformedTransaction = {
        transactionExternalId: id,
        transactionType: { name: 'Payment' },
        transactionStatus: { name: 'APPROVED' },
        value: 300,
        createdAt: new Date().toISOString(),
      };

      mockUpdateTransactionUseCase.execute.mockResolvedValue(updatedTransaction);

      const result = await resolver.updateTransaction(id, input);

      expect(mockUpdateTransactionUseCase.execute).toHaveBeenCalledWith(id, input);
      expect(result).toBe(updatedTransaction);
    });
  });
});
