import { TransactionStatusEnum } from "@common/enums/transaction";
import { TransactionEntity } from "@modules/transaction/domain/entities";
import { TransformedTransaction } from "../dto";

export class TransactionMapper {
  static toTransactionTransformed(transactionEntity: TransactionEntity): TransformedTransaction {
    return new TransformedTransaction({
      transactionExternalId: transactionEntity.id,
      transactionType: { name: "Tipo de transacción" },
      transactionStatus: { name: TransactionStatusEnum[transactionEntity.transactionStatus] },
      value: transactionEntity.value,
      createdAt: transactionEntity.createdAt.toISOString(),
    })
  }
}