import { EnvironmentService } from '@config/environment';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly environmentService: EnvironmentService) { }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, name, password, port, username } = this.environmentService.database;
    console.log(`Connecting to PostgreSQL at ${host}:${port} with user ${username} and database ${name}`);
    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database: name,
      entities: [],
      autoLoadEntities: true,
      synchronize: this.environmentService.environment !== 'production',
    };
  }
}
