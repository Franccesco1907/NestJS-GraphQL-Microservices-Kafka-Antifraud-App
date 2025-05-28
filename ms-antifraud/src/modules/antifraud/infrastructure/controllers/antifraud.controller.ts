import { VERIFY_ANTIFRAUD_PORT, VerifyAntifraudPortInterface } from '@modules/antifraud/domain/ports';
import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TransactionDto } from '../dto';

@Controller('antifraud')
export class AntifraudController {
  constructor(
    @Inject(VERIFY_ANTIFRAUD_PORT)
    private readonly verifyAntifraudUseCase: VerifyAntifraudPortInterface,
  ) { }

  @EventPattern('transaction.created')
  async handleTransactionCreated(transactionDto: TransactionDto) {
    this.verifyAntifraudUseCase.execute(transactionDto);
  }
}
