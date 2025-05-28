import { EnvironmentService } from '@config/environment';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { TransactionKafkaConfigService } from '@config/kafka';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const transactionKafkaConfigService = app.get(TransactionKafkaConfigService);
  const environmentService = app.get(EnvironmentService);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors(environmentService.cors);

  const config = new DocumentBuilder()
    .setTitle("Api Transaction Service's API")
    .setDescription(
      `Api Transaction Service's API
  <br>Created by: <b>Franccesco Jaimes Agreda</b>
  <br>GitHub: <a href="https://github.com/Franccesco1907" target="_blank">Franccesco1907</a>
  <br>Linkedin: <a href="https://www.linkedin.com/in/franccesco-michael-jaimes-agreda-7a00511a8/" target="_blank">Franccesco Michael Jaimes Agreda</a>
  <br>Gmail: <a href="mailto:franccescojaimesagreda@gmail.com">franccescojaimesagreda@gmail.com</a>
  `,
    )
    .setVersion('1.0')
    .addTag("Api Transaction Service's API")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.connectMicroservice<MicroserviceOptions>(
    transactionKafkaConfigService.createClientOptions(),
  )

  await app.startAllMicroservices();
  await app.listen(environmentService.apiPort);
}

bootstrap();