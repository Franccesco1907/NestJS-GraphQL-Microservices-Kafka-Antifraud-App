import { TransactionDto } from "@modules/antifraud/infrastructure/dto";

export const VERIFY_ANTIFRAUD_PORT = Symbol('VERIFY_ANTIFRAUD_PORT');

export abstract class VerifyAntifraudPortInterface {
  abstract execute(transactionDto: TransactionDto): Promise<void>;
}