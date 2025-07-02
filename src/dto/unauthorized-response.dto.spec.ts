import { UnauthorizedResponseDto } from './unauthorized-response.dto';

describe('UnauthorizedResponseDto', () => {
  it('should create an instance', () => {
    const dto = new UnauthorizedResponseDto();
    dto.message = 'Unauthorized';
    dto.statusCode = 401;

    expect(dto).toBeInstanceOf(UnauthorizedResponseDto);
    expect(dto.message).toBe('Unauthorized');
    expect(dto.statusCode).toBe(401);
  });
});
