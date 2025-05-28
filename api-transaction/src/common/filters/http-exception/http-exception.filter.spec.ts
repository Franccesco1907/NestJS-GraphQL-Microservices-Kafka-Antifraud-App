import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { AllExceptionFilter } from './http-exception.filter';

jest.mock('@nestjs/graphql', () => ({
  GqlArgumentsHost: {
    create: jest.fn(),
  },
}));

describe('AllExceptionFilter', () => {
  let filter: AllExceptionFilter;

  beforeEach(() => {
    filter = new AllExceptionFilter();
  });

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = {
    url: '/test-url',
  };

  const createMockHost = (exception: any) => {
    const res = mockResponse();
    return {
      getType: () => 'http',
      switchToHttp: () => ({
        getResponse: () => res,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  };

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const host = createMockHost(exception);

    filter.catch(exception, host);

    const expectedStatus = HttpStatus.FORBIDDEN;
    const res = host.switchToHttp().getResponse();

    expect(res.status).toHaveBeenCalledWith(expectedStatus);
    expect(res.json).toHaveBeenCalledWith({
      status: expectedStatus,
      data: null,
      errors: {
        error: exception.getResponse(),
        path: mockRequest.url,
      },
    });
  });

  it('should handle non-HttpException as 500', () => {
    const exception = new Error('Something went wrong');
    const host = createMockHost(exception);

    filter.catch(exception, host);

    const res = host.switchToHttp().getResponse();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      errors: {
        error: exception,
        path: mockRequest.url,
      },
    });
  });

  it('should handle GraphQL HttpException correctly with non-500 status', () => {
    const mockFieldName = 'graphqlField';
    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    const mockHost = {
      getType: () => 'graphql',
    } as unknown as ArgumentsHost;

    (GqlArgumentsHost.create as jest.Mock).mockReturnValue({
      getInfo: () => ({ fieldName: mockFieldName }),
    });

    try {
      filter.catch(exception, mockHost);
    } catch (err) {
      expect(err).toBeInstanceOf(GraphQLError);
      expect(err.message).toBe('Internal Server Error');
      expect(err.extensions.code).toBe('BAD_REQUEST');
      expect(err.extensions.status).toBe(HttpStatus.BAD_REQUEST);
      expect(err.extensions.error).toBe(exception.getResponse());
      expect(err.extensions.path).toBe(mockFieldName);
    }
  });

  it('should handle GraphQL exception correctly', () => {
    const mockFieldName = 'testField';
    const exception = new Error('GraphQL error');

    const mockHost = {
      getType: () => 'graphql',
    } as unknown as ArgumentsHost;

    (GqlArgumentsHost.create as jest.Mock).mockReturnValue({
      getInfo: () => ({ fieldName: mockFieldName }),
    });

    const filter = new AllExceptionFilter();

    try {
      filter.catch(exception, mockHost);
    } catch (err) {
      expect(err).toBeInstanceOf(GraphQLError);
      expect(err.message).toBe('Internal Server Error');
      expect(err.extensions.code).toBe('INTERNAL_SERVER_ERROR');
      expect(err.extensions.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(err.extensions.error).toBe(exception);
      expect(err.extensions.path).toBe(mockFieldName);
    }
  });
});
