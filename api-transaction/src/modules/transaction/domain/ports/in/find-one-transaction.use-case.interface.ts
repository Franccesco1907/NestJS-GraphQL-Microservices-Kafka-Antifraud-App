import { TransformedTransaction } from "@modules/transaction/infrastructure/dto";

export const FIND_ONE_TRANSACTION_USE_CASE = Symbol('FIND_ONE_TRANSACTION_USE_CASE');

export abstract class FindOneTransactionUseCaseInterface {
  abstract execute(id: string): Promise<TransformedTransaction>;
}