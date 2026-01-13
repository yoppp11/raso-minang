const { UserController } = require('../../controllers/userController');

// Set up JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key';

// Mock User model
jest.mock('../../models/index', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  }
}));

// Mock bcrypt
jest.mock('../../helpers/bcrypt', () => ({
  comparePassword: jest.fn()
}));

// Mock jwt
jest.mock('../../helpers/jwt', () => ({
  signToken: jest.fn()
}));

const { User } = require('../../models/index');
const { comparePassword } = require('../../helpers/bcrypt');
const { signToken } = require('../../helpers/jwt');

describe('UserController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('routeRegister', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        full_name: 'Test User',
        phone_number: '1234567890',
        address: '123 Test St'
      };

      mockReq.body = userData;
      User.create.mockResolvedValue({
        id: 1,
        username: userData.username,
        email: userData.email
      });

      await UserController.routeRegister(mockReq, mockRes, mockNext);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        id: 1,
        username: userData.username,
        email: userData.email
      });
    });

    it('should call next with error when registration fails', async () => {
      const error = new Error('Registration failed');
      mockReq.body = { email: 'test@example.com' };
      User.create.mockRejectedValue(error);

      await UserController.routeRegister(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('routeLogin', () => {
    it('should login successfully with valid credentials', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user'
      };

      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockReturnValue(true);
      signToken.mockReturnValue('mock_token');

      await UserController.routeLogin(mockReq, mockRes, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(comparePassword).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(signToken).toHaveBeenCalledWith({
        id: 1,
        email: 'test@example.com',
        role: 'user'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        access_token: 'mock_token',
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        }
      });
    });

    it('should throw BadRequest when email is missing', async () => {
      mockReq.body = { password: 'password123' };

      await UserController.routeLogin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Email is required' })
      );
    });

    it('should throw BadRequest when password is missing', async () => {
      mockReq.body = { email: 'test@example.com' };

      await UserController.routeLogin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Password is required' })
      );
    });

    it('should throw BadRequest when user not found', async () => {
      mockReq.body = { email: 'notfound@example.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);

      await UserController.routeLogin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Invalid email / password' })
      );
    });

    it('should throw BadRequest when password is invalid', async () => {
      mockReq.body = { email: 'test@example.com', password: 'wrongpassword' };
      
      User.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword'
      });
      comparePassword.mockReturnValue(false);

      await UserController.routeLogin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Invalid email / password' })
      );
    });
  });

  describe('routeCheckLogin', () => {
    it('should return user role', async () => {
      mockReq.user = { id: 1 };
      User.findOne.mockResolvedValue({ role: 'user' });

      await UserController.routeCheckLogin(mockReq, mockRes, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ role: 'user' });
    });
  });

  describe('routeGetUsers', () => {
    it('should return count of users with role user', async () => {
      User.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);

      await UserController.routeGetUsers(mockReq, mockRes, mockNext);

      expect(User.findAll).toHaveBeenCalledWith({
        where: { role: 'user' },
        attributes: { exclude: ['password'] }
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ users: 3 });
    });
  });
});
