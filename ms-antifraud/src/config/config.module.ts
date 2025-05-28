import { Global, Module } from '@nestjs/common';
import { EnvironmentModule } from './environment/modules/environment.module';
import { AntifraudKafkaModule, TransactionKafkaModule } from './kafka';

@Global()
@Module({
  imports: [
    EnvironmentModule,
    AntifraudKafkaModule,
    TransactionKafkaModule,
  ],
  exports: [
    EnvironmentModule,
    AntifraudKafkaModule,
    TransactionKafkaModule,
  ],
})
export class CustomConfigModule { }
