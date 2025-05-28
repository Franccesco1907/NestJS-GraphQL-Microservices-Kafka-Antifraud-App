import { FindOneTransactionUseCaseInterface } from "@modules/transaction/domain/ports/in";
import { TransformedTransaction } from "@modules/transaction/infrastructure/dto/responses/transformed-transaction-response.dto";
import { TransactionMapper } from "@modules/transaction/infrastructure/mappers";
import { TransactionRepository } from "@modules/transaction/infrastructure/repositories/transaction.repository";
import { Inject, NotFoundException } from "@nestjs/common";

export class FindOneTransactionUseCase implements FindOneTransactionUseCaseInterface {
  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository,
  ) { }

  async execute(id: string): Promise<TransformedTransaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return TransactionMapper.toTransactionTransformed(transaction)
  }
}