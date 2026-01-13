const { signToken, verifyToken } = require('../../helpers/jwt');

// Set up JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key';

describe('JWT Helper', () => {
  const testPayload = {
    id: 1,
    email: 'test@example.com',
    role: 'user'
  };

  describe('signToken', () => {
    it('should generate a valid JWT token', () => {
      const token = signToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = signToken({ id: 1 });
      const token2 = signToken({ id: 2 });
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const token = signToken(testPayload);
      const decoded = verifyToken(token);
      
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow();
    });

    it('should throw error for tampered token', () => {
      const token = signToken(testPayload);
      const tamperedToken = token + 'tampered';
      
      expect(() => {
        verifyToken(tamperedToken);
      }).toThrow();
    });
  });
});
