import { TransactionStatus } from "@common/enums/transaction";

export interface TransactionDto {
  id: string;
  value: number;
  transactionStatus?: TransactionStatus;
}