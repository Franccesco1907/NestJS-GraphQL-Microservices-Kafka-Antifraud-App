import { Field, Float, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateTransactionInput } from './create-transaction.input';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  accountExternalIdDebit?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  accountExternalIdCredit?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  tranferTypeId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  transactionStatus?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  value?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  createdAt?: Date;
}
