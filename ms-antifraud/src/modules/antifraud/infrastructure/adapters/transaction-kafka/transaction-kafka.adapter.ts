import { TransactionEntity } from "@modules/antifraud/domain/entities";
import { TransactionNotifierPortInterface } from "@modules/antifraud/domain/ports";
import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class TransactionKafkaAdapter implements TransactionNotifierPortInterface {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka,
  ) { }

  async notifyTransactionUpdate(transaction: TransactionEntity) {
    this.transactionClient.emit('transaction.update', JSON.stringify(transaction));
  }
}