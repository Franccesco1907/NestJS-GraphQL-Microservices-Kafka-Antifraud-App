import { AntifraudKafkaModule } from '@config/kafka';
import { CreateTransactionUseCase, FindAllTransactionUseCase, FindOneTransactionUseCase, UpdateTransactionUseCase } from '@modules/transaction/application';
import { TransactionEntity } from '@modules/transaction/domain/entities';
import { CREATE_TRANSACTION_USE_CASE, FIND_ALL_TRANSACTION_USE_CASE, FIND_ONE_TRANSACTION_USE_CASE, UPDATE_TRANSACTION_USE_CASE } from '@modules/transaction/domain/ports/in';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from '../repositories';
import { TransactionResolver } from '../resolvers/transaction.resolver';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    AntifraudKafkaModule,
  ],
  controllers: [
    TransactionController,
  ],
  providers: [
    TransactionResolver,
    TransactionRepository,
    {
      provide: CREATE_TRANSACTION_USE_CASE,
      useClass: CreateTransactionUseCase,
    },
    {
      provide: FIND_ALL_TRANSACTION_USE_CASE,
      useClass: FindAllTransactionUseCase,
    },
    {
      provide: FIND_ONE_TRANSACTION_USE_CASE,
      useClass: FindOneTransactionUseCase,
    },
    {
      provide: UPDATE_TRANSACTION_USE_CASE,
      useClass: UpdateTransactionUseCase,
    },
  ],
  exports: [
    TypeOrmModule
  ]
})
export class TransactionModule { }
