// test/common/interceptors/response.interceptor.spec.ts

import { ResponseDto } from '@common/utils';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should wrap response data in ResponseDto with status code', async () => {
    const mockResponse = {
      statusCode: 200,
    };

    const executionContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
      getType: <TContext extends string>() => 'http' as TContext,
    } as ExecutionContext;

    const testData = { message: 'Health check OK' };

    const callHandler: CallHandler = {
      handle: () => of(testData),
    };

    const result$ = interceptor.intercept(executionContext, callHandler);

    result$.subscribe((response) => {
      expect(response).toBeInstanceOf(ResponseDto);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(testData);
      expect(response.errors).toBeNull();
    });
  });

  it('should default to status 200 if statusCode is undefined', async () => {
    const mockResponse = {
      statusCode: undefined,
    };

    const executionContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
      getType: <TContext extends string>() => 'http' as TContext,
    } as unknown as ExecutionContext;

    const testData = { message: 'Default status' };

    const callHandler: CallHandler = {
      handle: () => of(testData),
    };

    const result$ = interceptor.intercept(executionContext, callHandler);

    result$.subscribe((response) => {
      expect(response.status).toBe(200);
    });
  });

  it('should not wrap response if context is GraphQL', async () => {
    const executionContext: Partial<ExecutionContext> = {
      getType: <TContext extends string>() => 'graphql' as TContext,
    };

    const testData = { message: 'GraphQL raw response' };

    const callHandler: CallHandler = {
      handle: () => of(testData),
    };

    const result$ = interceptor.intercept(executionContext as ExecutionContext, callHandler);

    result$.subscribe((response) => {
      expect(response).toEqual(testData);
    });
  });
});
