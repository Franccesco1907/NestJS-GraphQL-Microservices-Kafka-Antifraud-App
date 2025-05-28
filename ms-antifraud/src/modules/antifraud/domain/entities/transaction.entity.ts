import { TransactionStatus } from "@common/enums/transaction";

export class TransactionEntity {
  id: string;
  value: number;
  transactionStatus: TransactionStatus;

  constructor(data: Partial<TransactionEntity>) {
    Object.assign(this, data);
  }
}