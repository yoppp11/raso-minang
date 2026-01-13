const { hashPassword, comparePassword } = require('../../helpers/bcrypt');

describe('Bcrypt Helper', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', () => {
      const password = 'testPassword123';
      const hashedPassword = hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.startsWith('$2')).toBe(true);
    });

    it('should generate different hashes for the same password', () => {
      const password = 'testPassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const password = '';
      const hashedPassword = hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', () => {
      const password = 'testPassword123';
      const hashedPassword = hashPassword(password);
      const result = comparePassword(password, hashedPassword);
      
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = hashPassword(password);
      const result = comparePassword(wrongPassword, hashedPassword);
      
      expect(result).toBe(false);
    });

    it('should return false for empty password', () => {
      const password = 'testPassword123';
      const hashedPassword = hashPassword(password);
      const result = comparePassword('', hashedPassword);
      
      expect(result).toBe(false);
    });
  });
});
