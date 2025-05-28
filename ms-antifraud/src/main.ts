import { EnvironmentService } from '@config/environment';
import { AntifraudKafkaConfigService } from '@config/kafka';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService()
  const environmentService = new EnvironmentService(configService)
  const antifraudKafkaConfigService = new AntifraudKafkaConfigService(environmentService)

  const app = await NestFactory.createMicroservice(
    AppModule,
    antifraudKafkaConfigService.createClientOptions()
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  await app.listen()
    .then(() => console.log(`MS-Antifraud Service is running`));
}

bootstrap();