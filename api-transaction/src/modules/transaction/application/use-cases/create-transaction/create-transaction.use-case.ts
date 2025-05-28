import { TransactionEntity } from "@modules/transaction/domain/entities";
import { CreateTransactionUseCaseInterface } from "@modules/transaction/domain/ports/in";
import { CreateTransactionInput } from "@modules/transaction/infrastructure/dto";
import { TransactionRepository } from "@modules/transaction/infrastructure/repositories/transaction.repository";
import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

export class CreateTransactionUseCase implements CreateTransactionUseCaseInterface {
  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository,
    @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka,
  ) { }

  async execute(createTransactionInput: CreateTransactionInput): Promise<TransactionEntity> {
    const newTransaction = this.transactionRepository.create(createTransactionInput);
    const savedTransaction = await this.transactionRepository.save(newTransaction);

    await this.emitTransactionCreatedEvent(savedTransaction);
    return savedTransaction;
  }

  private async emitTransactionCreatedEvent(transaction: TransactionEntity) {
    try {
      this.antifraudClient.emit('transaction.created', JSON.stringify({
        id: transaction.id,
        value: transaction.value,
      }));
    } catch (error) {
      console.error('Error emitting transaction created event:', error);
    }
  }
}