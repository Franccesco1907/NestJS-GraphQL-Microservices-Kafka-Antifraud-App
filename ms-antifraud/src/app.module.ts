import { AllExceptionFilter } from '@common/filters';
import { LoggingInterceptor, ResponseInterceptor, TimeOutInterceptor } from '@common/interceptors';
import { CustomConfigModule } from '@config/config.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntifraudModule } from '@modules/antifraud/infrastructure/controllers/antifraud.module';

@Module({
  imports: [
    CustomConfigModule,
    AntifraudModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeOutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],

})
export class AppModule { }
