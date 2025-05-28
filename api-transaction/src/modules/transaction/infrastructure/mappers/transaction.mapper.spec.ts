import { TransactionStatusEnum } from '@common/enums/transaction';
import { TransactionEntity } from '@modules/transaction/domain/entities';
import { TransformedTransaction } from '../dto';
import { TransactionMapper } from './transaction.mapper';

describe('TransactionMapper', () => {
  describe('toTransactionTransformed', () => {
    it('should map TransactionEntity to TransformedTransaction correctly', () => {
      const transactionDate = new Date('2024-01-01T12:00:00Z');

      const transactionEntity: TransactionEntity = {
        id: 'txn-123',
        transactionStatus: TransactionStatusEnum.PENDING,
        value: 150,
        createdAt: transactionDate,
      } as TransactionEntity;

      const result = TransactionMapper.toTransactionTransformed(transactionEntity);

      expect(result).toBeInstanceOf(TransformedTransaction);
      expect(result).toEqual({
        transactionExternalId: 'txn-123',
        transactionType: { name: 'Tipo de transacción' },
        transactionStatus: { name: 'PENDING' },
        value: 150,
        createdAt: transactionDate.toISOString(),
      });
    });
  });
});
