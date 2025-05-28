import { DataSource, Repository } from 'typeorm';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity } from '@modules/transaction/domain/entities';
import { NotFoundException } from '@nestjs/common';

describe('TransactionRepository', () => {
  let repo: TransactionRepository;
  let mockTypeOrmRepo: jest.Mocked<Repository<TransactionEntity>>;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockTypeOrmRepo = {
      target: TransactionEntity,
    } as any;

    mockDataSource = {
      createEntityManager: jest.fn().mockReturnValue({}),
    } as any;

    repo = new TransactionRepository(mockTypeOrmRepo, mockDataSource);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('findOneByOrFail', () => {
    it('should return entity when found and not deleted', async () => {
      const entity = { id: '1', deletedAt: null } as TransactionEntity;
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(entity);

      const result = await repo.findOneByOrFail({ id: '1' });

      expect(result).toBe(entity);
    });

    it('should throw NotFoundException when entity not found', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

      await expect(repo.findOneByOrFail({ id: '1' })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when entity is soft-deleted', async () => {
      const deletedEntity = { id: '1', deletedAt: new Date() } as TransactionEntity;
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(deletedEntity);

      await expect(repo.findOneByOrFail({ id: '1' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('createEntity', () => {
    it('should create and save entity with UUID', async () => {
      const partial: Partial<TransactionEntity> = { value: 100 };
      const created = { ...partial, id: 'uuid-123' } as TransactionEntity;

      jest.spyOn(repo, 'create').mockReturnValue(created);
      jest.spyOn(repo, 'save').mockResolvedValue(created);
      jest.spyOn(require('crypto'), 'randomUUID').mockReturnValue('uuid-123');

      const result = await repo.createEntity(partial);

      expect(result).toEqual(created);
    });
  });

  describe('softDeleteEntity', () => {
    it('should soft delete entity if not already deleted', async () => {
      const entity = { id: '1', deletedAt: null } as TransactionEntity;
      jest.spyOn(repo, 'findOneByIdOrFail').mockResolvedValue(entity);
      const softRemoveSpy = jest.spyOn(repo, 'softRemove').mockResolvedValue(entity);

      await repo.softDeleteEntity('1');

      expect(softRemoveSpy).toHaveBeenCalledWith(entity);
    });

    it('should throw if entity is already deleted', async () => {
      const entity = { id: '1', deletedAt: new Date() } as TransactionEntity;
      jest.spyOn(repo, 'findOneByIdOrFail').mockResolvedValue(entity);

      await expect(repo.softDeleteEntity('1')).rejects.toThrow();
    });
  });
});
