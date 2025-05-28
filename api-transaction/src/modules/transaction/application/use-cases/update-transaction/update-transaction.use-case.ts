import { FIND_ONE_TRANSACTION_USE_CASE, FindOneTransactionUseCaseInterface } from "@modules/transaction/domain/ports/in";
import { UpdateTransactionUseCaseInterface } from "@modules/transaction/domain/ports/in/update-transaction.use-case.interface";
import { TransformedTransaction, UpdateTransactionInput } from "@modules/transaction/infrastructure/dto";
import { TransactionMapper } from "@modules/transaction/infrastructure/mappers";
import { TransactionRepository } from "@modules/transaction/infrastructure/repositories/transaction.repository";
import { Inject, NotFoundException } from "@nestjs/common";

export class UpdateTransactionUseCase implements UpdateTransactionUseCaseInterface {
  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository,
    @Inject(FIND_ONE_TRANSACTION_USE_CASE) private readonly findOneTransactionUseCase: FindOneTransactionUseCaseInterface,
  ) { }

  async execute(id: string, updateTransactionInput: UpdateTransactionInput): Promise<TransformedTransaction> {
    await this.findOneTransactionUseCase.execute(id);
    const transaction = await this.transactionRepository.preload({ id, ...updateTransactionInput });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    const transactionSaved = await this.transactionRepository.save(transaction);
    return TransactionMapper.toTransactionTransformed(transactionSaved);
  }
}