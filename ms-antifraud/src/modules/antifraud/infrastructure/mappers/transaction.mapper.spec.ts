import { TransactionEntity } from '@modules/antifraud/domain/entities';
import { TransactionDto } from '../dto';
import { TransactionMapper } from './transaction.mapper';

describe('TransactionMapper', () => {
  const mockDto: TransactionDto = {
    id: 'uuid-001',
    value: 1000,
    transactionStatus: 1,
  };

  const mockEntity = new TransactionEntity({
    id: 'uuid-002',
    value: 2000,
    transactionStatus: 2,
  });

  describe('toTransactionEntity', () => {
    it('should correctly map TransactionDto to TransactionEntity', () => {
      const entity = TransactionMapper.toTransactionEntity(mockDto);

      expect(entity).toBeInstanceOf(TransactionEntity);
      expect(entity.id).toBe(mockDto.id);
      expect(entity.value).toBe(mockDto.value);
      expect(entity.transactionStatus).toBe(mockDto.transactionStatus);
    });
  });

  describe('toTransactionDto', () => {
    it('should correctly map TransactionEntity to TransactionDto', () => {
      const dto = TransactionMapper.toTransactionDto(mockEntity);

      expect(dto).toEqual({
        id: mockEntity.id,
        value: mockEntity.value,
        transactionStatus: mockEntity.transactionStatus,
      });
    });
  });
});
