const { authMiddleware, superAdminMiddleware } = require('../../middlewares/authMiddleware');
const { signToken } = require('../../helpers/jwt');

// Set up JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key';

// Mock User model
jest.mock('../../models/index', () => ({
  User: {
    findOne: jest.fn()
  }
}));

const { User } = require('../../models/index');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should call next() for valid token', async () => {
      const token = signToken({ email: 'test@example.com' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      User.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'user'
      });

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.email).toBe('test@example.com');
    });

    it('should call next with error for missing authorization header', async () => {
      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Unauthorized' })
      );
    });

    it('should call next with error for invalid token format', async () => {
      mockReq.headers.authorization = 'InvalidFormat';

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Unauthorized' })
      );
    });

    it('should call next with error for user not found', async () => {
      const token = signToken({ email: 'notfound@example.com' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      User.findOne.mockResolvedValue(null);

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Unauthorized' })
      );
    });
  });

  describe('superAdminMiddleware', () => {
    it('should call next() for valid superadmin token', async () => {
      const token = signToken({ email: 'superadmin@example.com' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      User.findOne.mockResolvedValue({
        id: 1,
        email: 'superadmin@example.com',
        full_name: 'Super Admin',
        role: 'superadmin'
      });

      await superAdminMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.role).toBe('superadmin');
    });

    it('should call next with Forbidden error for non-superadmin', async () => {
      const token = signToken({ email: 'user@example.com' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      User.findOne.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        full_name: 'Regular User',
        role: 'user'
      });

      await superAdminMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Forbidden' })
      );
    });

    it('should call next with error for missing authorization', async () => {
      await superAdminMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Unauthorized' })
      );
    });
  });
});
