import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
}

describe('AuthGuard', () => {
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;
  let logger: { error: jest.Mock; warn: jest.Mock };

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    configService = {
      get: jest.fn().mockReturnValue('mock-secret'),
    };
    logger = {
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  it('should throw UnauthorizedException when token is missing', async () => {
    const guard = new AuthGuard(jwtService as JwtService, configService as ConfigService, logger);
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException({
        message: 'Token not provided',
        statusCode: 401,
      }),
    );
  });

  it('should throw UnauthorizedException when token is valid but missing sub', async () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ email: 'user@email.com' });

    const guard = new AuthGuard(jwtService as JwtService, configService as ConfigService, logger);
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException({
        message: 'Invalid token payload',
        statusCode: 401,
      }),
    );

    expect(logger.warn).toHaveBeenCalledWith('Token payload missing sub claim');
  });

  it('should allow access and attach user payload when token is valid', async () => {
    const payload: JwtPayload = { sub: '123', role: 'user' };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

    const guard = new AuthGuard(jwtService as JwtService, configService as ConfigService, logger);
    const mockRequest: any = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    };

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(payload);
  });

  it('should throw UnauthorizedException when authorization header is malformed', async () => {
    const guard = new AuthGuard(jwtService as JwtService, configService as ConfigService, logger);

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Token abc123', // invalid prefix
          },
        }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException({
        message: 'Token not provided',
        statusCode: 401,
      }),
    );
  });

  describe.each([
    {
      description: 'token is invalid',
      error: new Error('invalid token'),
      token: 'invalid-token',
    },
    {
      description: 'token is expired',
      error: Object.assign(new Error('jwt expired'), { name: 'TokenExpiredError' }),
      token: 'expired-token',
    },
    {
      description: 'token has invalid signature',
      error: Object.assign(new Error('invalid signature'), { name: 'JsonWebTokenError' }),
      token: 'fake-token',
    },
    {
      description: 'token is malformed',
      error: Object.assign(new Error('jwt malformed'), { name: 'JsonWebTokenError' }),
      token: 'malformed-token',
    },
  ])('should throw UnauthorizedException when $description', ({ error, token }) => {
    it(`throws and logs for token: ${token}`, async () => {
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

      const guard = new AuthGuard(jwtService as JwtService, configService as ConfigService, logger);
      const context: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        }),
      };

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException({
          message: 'Invalid token',
          statusCode: 401,
        }),
      );

      expect(logger.error).toHaveBeenCalledWith(
        `Token validation failed: ${error.name} - ${error.message}`,
      );
    });
  });
});
