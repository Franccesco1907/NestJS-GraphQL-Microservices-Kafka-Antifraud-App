import { TransactionEntity } from "../../entities";

export abstract class TransactionNotifierPortInterface {
  abstract notifyTransactionUpdate(transaction: TransactionEntity): Promise<void>;
}