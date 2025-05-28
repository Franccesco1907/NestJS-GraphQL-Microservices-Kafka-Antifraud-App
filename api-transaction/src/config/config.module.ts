import { Global, Module } from '@nestjs/common';
import { CustomGraphQLModule } from './custom-graphql';
import { EnvironmentModule } from './environment/modules/environment.module';
import { AntifraudKafkaModule, TransactionKafkaModule } from './kafka';

@Global()
@Module({
  imports: [
    EnvironmentModule,
    AntifraudKafkaModule,
    // TransactionKafkaModule,
    CustomGraphQLModule,
  ],
  exports: [
    EnvironmentModule,
    AntifraudKafkaModule,
    // TransactionKafkaModule,
    CustomGraphQLModule,
  ],
})
export class CustomConfigModule { }
