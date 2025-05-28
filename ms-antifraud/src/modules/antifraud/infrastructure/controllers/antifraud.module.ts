import { VerifyAntifraudUseCase } from "@modules/antifraud/application";
import { TransactionNotifierPortInterface, VERIFY_ANTIFRAUD_PORT } from "@modules/antifraud/domain/ports";
import { Module } from "@nestjs/common";
import { TransactionKafkaAdapter } from "../adapters";
import { AntifraudController } from "./antifraud.controller";

@Module({
  imports: [],
  controllers: [AntifraudController],
  providers: [
    {
      provide: VERIFY_ANTIFRAUD_PORT,
      useClass: VerifyAntifraudUseCase,
    },
    {
      provide: TransactionNotifierPortInterface,
      useClass: TransactionKafkaAdapter,
    }
  ],
})
export class AntifraudModule { }