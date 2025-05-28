import { FindAllTransactionUseCaseInterface } from "@modules/transaction/domain/ports/in";
import { TransformedTransaction } from "@modules/transaction/infrastructure/dto";
import { TransactionMapper } from "@modules/transaction/infrastructure/mappers/transaction.mapper";
import { TransactionRepository } from "@modules/transaction/infrastructure/repositories";
import { Inject } from "@nestjs/common";

export class FindAllTransactionUseCase implements FindAllTransactionUseCaseInterface {
  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository,
  ) { }

  async execute(): Promise<TransformedTransaction[]> {
    const transactions = await this.transactionRepository.findEntities({});
    const transformedTransactions: TransformedTransaction[] = transactions.map(transaction => (
      TransactionMapper.toTransactionTransformed(transaction)
    ));
    return transformedTransactions;
  }
}