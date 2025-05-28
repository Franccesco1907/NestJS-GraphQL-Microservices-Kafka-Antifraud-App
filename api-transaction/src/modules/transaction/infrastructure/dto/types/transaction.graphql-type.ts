import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BaseGraphQLType } from './base.graphql-type';

@ObjectType('Transaction')
export class TransactionGraphQLType extends BaseGraphQLType {
  @Field(() => String)
  accountExternalIdDebit: string;

  @Field(() => String)
  accountExternalIdCredit: string;

  @Field(() => Int)
  tranferTypeId: number;

  @Field(() => Int)
  transactionStatus: number;

  @Field(() => Float)
  value: number;
}