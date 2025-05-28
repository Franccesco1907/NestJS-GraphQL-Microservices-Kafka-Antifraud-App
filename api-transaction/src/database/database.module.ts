import { Global, Module } from '@nestjs/common';
import { TypeOrmDatabaseModule } from './typeorm';

@Global()
@Module({
  imports: [
    TypeOrmDatabaseModule,
  ],
  exports: [
    TypeOrmDatabaseModule,
  ],
})
export class DatabaseModule { }
