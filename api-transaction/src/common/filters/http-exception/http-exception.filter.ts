import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const contextType = host.getType<'http' | 'rpc' | 'ws' | 'graphql'>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(`Status ${status} Error: ${JSON.stringify(message)}`);

    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse();
      const req = ctx.getRequest();

      res.status(status).json({
        status,
        data: null,
        errors: {
          error: message,
          path: req.url,
        },
      });
    } else if (contextType === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const path = gqlHost.getInfo().fieldName;

      throw new GraphQLError('Internal Server Error', {
        extensions: {
          code: status === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST',
          status,
          error: message,
          path,
        },
      });
    }
  }
}
