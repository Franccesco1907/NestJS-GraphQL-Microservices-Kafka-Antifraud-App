import { TransactionStatusEnum } from '@common/enums/transaction';
import { CustomBaseEntity } from '@database/typeorm/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity extends CustomBaseEntity {
  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  tranferTypeId: number;

  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING,
  })
  transactionStatus: number;

  @Column({ type: 'float' })
  value: number;

  constructor(data: Partial<TransactionEntity>) {
    super();
    Object.assign(this, data);
  }
}
