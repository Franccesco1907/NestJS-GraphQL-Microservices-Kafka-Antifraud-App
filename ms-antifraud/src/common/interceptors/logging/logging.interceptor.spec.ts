import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    loggerSpy = jest.spyOn(interceptor['logger'], 'log').mockImplementation(() => { });

    mockExecutionContext = {
      getType: jest.fn().mockReturnValue('http'),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(() => ({
          get: jest.fn().mockReturnValue('mock-user-agent'),
          ip: '127.0.0.1',
          method: 'GET',
          path: '/test',
          user: { userId: 'user123' },
        })),
        getResponse: jest.fn(() => ({
          statusCode: 200,
          get: jest.fn().mockReturnValue('123'),
        })),
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    mockCallHandler = {
      handle: jest.fn(() => of('response')),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log request and response for HTTP context with user-agent', (done) => {
    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledTimes(2);
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('[') &&
          expect.stringContaining(
            'GET /test user123 mock-user-agent 127.0.0.1: TestController testMethod',
          ),
        );
        expect(mockCallHandler.handle).toHaveBeenCalled();
        done();
      });
  });

  it('should log request and response for HTTP context without user-agent', (done) => {
    (mockExecutionContext.switchToHttp as jest.Mock).mockReturnValue({
      getRequest: jest.fn(() => ({
        get: jest.fn().mockReturnValue(undefined),
        ip: '127.0.0.1',
        method: 'GET',
        path: '/test',
        user: { userId: 'user123' },
      })),
      getResponse: jest.fn(() => ({
        statusCode: 200,
        get: jest.fn().mockReturnValue('123'),
      })),
    });

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledTimes(2);
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('[') &&
          expect.stringContaining('GET /test user123  127.0.0.1: TestController testMethod'),
        );
        expect(mockCallHandler.handle).toHaveBeenCalled();
        done();
      });
  });

  it('should bypass logging for non-HTTP context', (done) => {
    (mockExecutionContext.getType as jest.Mock).mockReturnValue('rpc');
    (mockExecutionContext.switchToRpc as jest.Mock) = jest.fn().mockReturnValue({
      getData: jest.fn().mockReturnValue({}),
    });

    (mockExecutionContext.getHandler as jest.Mock).mockReturnValue({ name: 'handler' });
    (mockExecutionContext.getClass as jest.Mock).mockReturnValue({ name: 'TestService' });

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('Event received: TestService.handler'),
        );
        done();
      });
  });

  it('should log RPC event and payload correctly', (done) => {
    const mockData = { foo: 'bar' };
    (mockExecutionContext.getType as jest.Mock).mockReturnValue('rpc');
    (mockExecutionContext.switchToRpc as jest.Mock) = jest.fn().mockReturnValue({
      getData: jest.fn().mockReturnValue(mockData),
    });
    (mockExecutionContext.getHandler as jest.Mock).mockReturnValue({ name: 'handleEvent' });
    (mockExecutionContext.getClass as jest.Mock).mockReturnValue({ name: 'TestService' });

    const debugSpy = jest.spyOn(interceptor['logger'], 'debug').mockImplementation(() => { });

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('Event received: TestService.handleEvent'),
        );
        expect(debugSpy).toHaveBeenCalledWith(
          expect.stringContaining('Payload: {"foo":"bar"}'),
        );
        done();
      });
  });


  it('should skip logging for unknown context type', (done) => {
    (mockExecutionContext.getType as jest.Mock).mockReturnValue('ws');

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).not.toHaveBeenCalled();
        done();
      });
  });
});
