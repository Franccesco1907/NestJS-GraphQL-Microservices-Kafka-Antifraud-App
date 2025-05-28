import { TransactionNotifierPortInterface, VerifyAntifraudPortInterface } from "@modules/antifraud/domain/ports";
import { TransactionDto } from "@modules/antifraud/infrastructure/dto";
import { TransactionMapper } from "@modules/antifraud/infrastructure/mappers";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VerifyAntifraudUseCase implements VerifyAntifraudPortInterface {
  constructor(
    private readonly transactionNotifier: TransactionNotifierPortInterface,
  ) { }

  async execute(transactionDto: TransactionDto) {
    const transactionEntity = TransactionMapper.toTransactionEntity(transactionDto);
    this.transactionNotifier.notifyTransactionUpdate(transactionEntity);
  }
}