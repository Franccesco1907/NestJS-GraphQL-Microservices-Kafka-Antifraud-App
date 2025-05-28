import { TransformedTransaction, UpdateTransactionInput } from "@modules/transaction/infrastructure/dto";

export const UPDATE_TRANSACTION_USE_CASE = Symbol('UPDATE_TRANSACTION_USE_CASE');

export abstract class UpdateTransactionUseCaseInterface {
  abstract execute(id: string, updateTransactionInput: UpdateTransactionInput): Promise<TransformedTransaction>;
}