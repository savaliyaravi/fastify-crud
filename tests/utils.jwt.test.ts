import { signToken, verifyToken } from '../src/utils/jwt';

describe('utils/jwt', () => {
  it('signs and verifies a token', () => {
    const token = signToken({ userId: 'user123', email: 'user@example.com' });
    const payload = verifyToken(token);
    expect(payload.userId).toBe('user123');
    expect(payload.email).toBe('user@example.com');
  });
});





