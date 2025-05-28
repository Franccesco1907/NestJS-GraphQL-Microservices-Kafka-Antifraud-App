import { UPDATE_TRANSACTION_USE_CASE, UpdateTransactionUseCaseInterface } from "@modules/transaction/domain/ports/in";
import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { AntifraudResponseDto } from "../dto";
import { TransactionStatusEnum } from "@common/enums/transaction";


@Controller("transaction")
export class TransactionController {
  constructor(
    @Inject(UPDATE_TRANSACTION_USE_CASE) private readonly updateTransactionUseCase: UpdateTransactionUseCaseInterface,
  ) { }

  @EventPattern('transaction.update')
  async handleTransactionUpdate(@Payload() transaction: AntifraudResponseDto) {
    return await this.updateTransactionUseCase.execute(transaction.id, {
      transactionStatus: TransactionStatusEnum.APPROVED,
    });
  }
}