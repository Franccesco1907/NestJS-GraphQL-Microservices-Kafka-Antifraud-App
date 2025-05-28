import { CREATE_TRANSACTION_USE_CASE, CreateTransactionUseCaseInterface, FIND_ALL_TRANSACTION_USE_CASE, FIND_ONE_TRANSACTION_USE_CASE, FindAllTransactionUseCaseInterface, FindOneTransactionUseCaseInterface, UPDATE_TRANSACTION_USE_CASE, UpdateTransactionUseCaseInterface } from '@modules/transaction/domain/ports/in';
import { Inject } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionInput, TransformedTransaction, UpdateTransactionInput } from '../dto';
import { TransactionGraphQLType } from '../dto/types';

@Resolver(() => TransactionGraphQLType)
export class TransactionResolver {
  constructor(
    @Inject(CREATE_TRANSACTION_USE_CASE) private readonly createTransactionUseCase: CreateTransactionUseCaseInterface,
    @Inject(FIND_ALL_TRANSACTION_USE_CASE) private readonly findAllTransactionUseCase: FindAllTransactionUseCaseInterface,
    @Inject(FIND_ONE_TRANSACTION_USE_CASE) private readonly findOneTransactionUseCase: FindOneTransactionUseCaseInterface,
    @Inject(UPDATE_TRANSACTION_USE_CASE) private readonly updateTransactionUseCase: UpdateTransactionUseCaseInterface,
  ) { }

  @Mutation(() => TransactionGraphQLType)
  createTransaction(
    @Args('createTransactionInput') createTransactionInput: CreateTransactionInput,
  ) {
    return this.createTransactionUseCase.execute(createTransactionInput);
  }

  @Query(() => [TransformedTransaction], { name: 'transactions' })
  async findAll() {
    const transactions = await this.findAllTransactionUseCase.execute();
    return transactions;
  }

  @Query(() => TransformedTransaction, { name: 'transaction' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.findOneTransactionUseCase.execute(id);
  }

  @Mutation(() => TransformedTransaction)
  updateTransaction(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.updateTransactionUseCase.execute(id, updateTransactionInput);
  }
}
