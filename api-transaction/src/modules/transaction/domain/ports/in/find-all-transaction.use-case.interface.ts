import { TransformedTransaction } from "@modules/transaction/infrastructure/dto";

export const FIND_ALL_TRANSACTION_USE_CASE = Symbol('FIND_ALL_TRANSACTION_USE_CASE');

export abstract class FindAllTransactionUseCaseInterface {
  abstract execute(): Promise<TransformedTransaction[]>;
}