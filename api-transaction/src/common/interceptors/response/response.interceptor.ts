import { ResponseDto } from '@common/utils';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isGraphQL = context.getType<'http' | 'rpc' | 'ws' | 'graphql'>() === 'graphql';

    return next.handle().pipe(
      map((data) => {
        if (isGraphQL) {
          return data;
        }

        const response = context.switchToHttp().getResponse();
        const status = response.statusCode || HttpStatus.OK;
        return new ResponseDto(status, data, null);
      }),
    );
  }
}
