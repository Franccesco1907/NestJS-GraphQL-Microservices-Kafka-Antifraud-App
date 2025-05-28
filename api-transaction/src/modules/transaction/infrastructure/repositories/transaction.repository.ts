import { TypeOrmBaseRepository } from "@database/typeorm/repositories";
import { TransactionEntity } from "@modules/transaction/domain/entities";
import { TransactionRepositoryInterface } from "@modules/transaction/domain/ports/out/repositories";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class TransactionRepository extends TypeOrmBaseRepository<TransactionEntity> implements TransactionRepositoryInterface {

  constructor(
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
    private dataSource: DataSource,
  ) {
    super(transactionRepository.target, dataSource);
  }
}