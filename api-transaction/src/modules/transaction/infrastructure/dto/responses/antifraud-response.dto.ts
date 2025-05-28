import { TransactionStatusEnum } from "src/common/enums/transaction";

export interface AntifraudResponseDto {
  id: string;
  value: number;
  transactionStatus: TransactionStatusEnum;
}