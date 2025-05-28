import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { EnvironmentService } from "../../environment";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TRANSACTION_SERVICE',
        useFactory: (environmentService: EnvironmentService) => {
          const { clientId, host, groupId } = environmentService.transactionKafka;

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId,
                brokers: [host],
                retry: {
                  initialRetryTime: 100,
                  retries: 10,
                }
              },
              consumer: {
                groupId,
              },
            },
          };
        },
        inject: [EnvironmentService],
      }
    ]),
  ],
  exports: [ClientsModule],
})
export class TransactionKafkaModule { };