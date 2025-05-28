import { TransactionEntity } from "@modules/antifraud/domain/entities";
import { TransactionDto } from "../dto";

export class TransactionMapper {
  static toTransactionEntity(transactionDto: TransactionDto): TransactionEntity {
    return new TransactionEntity({
      id: transactionDto.id,
      value: transactionDto.value,
      transactionStatus: transactionDto.transactionStatus,
    });
  }

  static toTransactionDto(transactionEntity: TransactionEntity): TransactionDto {
    return {
      id: transactionEntity.id,
      value: transactionEntity.value,
      transactionStatus: transactionEntity.transactionStatus,
    };
  }
}