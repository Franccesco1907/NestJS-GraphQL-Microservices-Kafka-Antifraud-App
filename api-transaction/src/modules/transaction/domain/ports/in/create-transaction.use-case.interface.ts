import { CreateTransactionInput } from "@modules/transaction/infrastructure/dto";
import { TransactionEntity } from "../../entities";

export const CREATE_TRANSACTION_USE_CASE = Symbol('CREATE_TRANSACTION_USE_CASE');

export abstract class CreateTransactionUseCaseInterface {
  abstract execute(createTransactionInput: CreateTransactionInput): Promise<TransactionEntity>;
}