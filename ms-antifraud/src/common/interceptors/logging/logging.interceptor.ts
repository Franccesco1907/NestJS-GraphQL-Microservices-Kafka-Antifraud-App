import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }

    if (context.getType() === 'rpc') {
      return this.logRpcCall(context, next);
    }

    return next.handle();
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') ?? '';
    const { ip, method, path: url } = request;
    const correlationKey = randomUUID();
    const userId = request.user?.userId;

    this.logger.log(
      `[${correlationKey}] ${method} ${url} ${userId} ${userAgent} ${ip}: ${context.getClass().name
      } ${context.getHandler().name}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(
          `[${correlationKey}] ${method} ${url} ${statusCode} ${contentLength}: ${Date.now() - now
          }ms`,
        );
      }),
    );
  }

  private logRpcCall(context: ExecutionContext, next: CallHandler) {
    const handler = context.getHandler().name;
    const className = context.getClass().name;

    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();

    const correlationKey = randomUUID();

    this.logger.log(`[${correlationKey}] Event received: ${className}.${handler}`);
    this.logger.debug(`[${correlationKey}] Payload: ${JSON.stringify(data)}`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`[${correlationKey}] Event processed in ${Date.now() - now}ms`);
      }),
    );
  }

}
