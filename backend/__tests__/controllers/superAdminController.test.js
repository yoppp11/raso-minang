const { SuperAdminController } = require('../../controllers/superAdminController');

// Mock models
jest.mock('../../models', () => ({
  User: {
    count: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  Order: {
    count: jest.fn(),
    sum: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn()
  },
  Order_Item: {},
  Menu_Item: {
    count: jest.fn()
  },
  Category: {
    count: jest.fn()
  },
  Conversation: {},
  Message: {
    count: jest.fn()
  },
  Op: {
    gte: Symbol('gte'),
    notIn: Symbol('notIn'),
    or: Symbol('or'),
    iLike: Symbol('iLike')
  }
}));

const { User, Order, Menu_Item, Category, Message } = require('../../models');

describe('SuperAdminController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      query: {},
      user: { id: 1, role: 'superadmin' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('routeGetStats', () => {
    it('should return dashboard statistics', async () => {
      User.count.mockResolvedValueOnce(100).mockResolvedValueOnce(5);
      Order.count.mockResolvedValueOnce(500).mockResolvedValueOnce(50).mockResolvedValueOnce(10).mockResolvedValueOnce(25);
      Order.sum.mockResolvedValueOnce(50000000).mockResolvedValueOnce(5000000);
      Menu_Item.count.mockResolvedValue(30);
      Category.count.mockResolvedValue(6);
      Message.count.mockResolvedValue(3);
      Order.findAll.mockResolvedValue([]);

      await SuperAdminController.routeGetStats(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          totalUsers: 100,
          totalAdmins: 5,
          totalOrders: 500,
          totalRevenue: 50000000,
          totalMenuItems: 30,
          totalCategories: 6,
          unreadMessages: 3
        })
      });
    });

    it('should handle null revenue', async () => {
      User.count.mockResolvedValue(0);
      Order.count.mockResolvedValue(0);
      Order.sum.mockResolvedValue(null);
      Menu_Item.count.mockResolvedValue(0);
      Category.count.mockResolvedValue(0);
      Message.count.mockResolvedValue(0);
      Order.findAll.mockResolvedValue([]);

      await SuperAdminController.routeGetStats(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          totalRevenue: 0,
          revenueThisMonth: 0
        })
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      User.count.mockRejectedValue(error);

      await SuperAdminController.routeGetStats(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('routeGetUsers', () => {
    it('should return paginated users', async () => {
      mockReq.query = { page: 1, limit: 10 };
      const mockUsers = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];
      User.findAndCountAll.mockResolvedValue({ count: 2, rows: mockUsers });

      await SuperAdminController.routeGetUsers(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: {
          users: mockUsers,
          pagination: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        }
      });
    });

    it('should filter by role', async () => {
      mockReq.query = { role: 'admin' };
      User.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ id: 1, role: 'admin' }] });

      await SuperAdminController.routeGetUsers(mockReq, mockRes, mockNext);

      expect(User.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe('routeGetUserById', () => {
    it('should return user by id', async () => {
      mockReq.params = { id: '1' };
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      User.findByPk.mockResolvedValue(mockUser);

      await SuperAdminController.routeGetUserById(mockReq, mockRes, mockNext);

      expect(User.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: mockUser
      });
    });

    it('should throw NotFound when user not found', async () => {
      mockReq.params = { id: '999' };
      User.findByPk.mockResolvedValue(null);

      await SuperAdminController.routeGetUserById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'User not found' })
      );
    });
  });

  describe('routeUpdateUserRole', () => {
    it('should update user role successfully', async () => {
      mockReq.params = { id: '2' };
      mockReq.body = { role: 'admin' };
      const mockUser = { 
        id: 2, 
        username: 'user2',
        email: 'user2@example.com',
        role: 'user',
        update: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);

      await SuperAdminController.routeUpdateUserRole(mockReq, mockRes, mockNext);

      expect(mockUser.update).toHaveBeenCalledWith({ role: 'admin' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should throw BadRequest for invalid role', async () => {
      mockReq.params = { id: '2' };
      mockReq.body = { role: 'invalid_role' };

      await SuperAdminController.routeUpdateUserRole(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Invalid role' })
      );
    });

    it('should throw BadRequest when trying to change own role', async () => {
      mockReq.params = { id: '1' }; // Same as req.user.id
      mockReq.body = { role: 'admin' };
      const mockUser = { id: 1, role: 'superadmin' };
      User.findByPk.mockResolvedValue(mockUser);

      await SuperAdminController.routeUpdateUserRole(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Cannot change your own role' })
      );
    });

    it('should throw NotFound when user not found', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { role: 'admin' };
      User.findByPk.mockResolvedValue(null);

      await SuperAdminController.routeUpdateUserRole(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'User not found' })
      );
    });
  });

  describe('routeCreateAdmin', () => {
    it('should create admin user successfully', async () => {
      mockReq.body = {
        username: 'newadmin',
        email: 'admin@example.com',
        password: 'password123',
        full_name: 'New Admin',
        phone_number: '1234567890',
        role: 'admin'
      };
      const mockUser = { id: 1, username: 'newadmin', email: 'admin@example.com', role: 'admin' };
      User.create.mockResolvedValue(mockUser);

      await SuperAdminController.routeCreateAdmin(mockReq, mockRes, mockNext);

      expect(User.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'admin created successfully',
        data: expect.objectContaining({ role: 'admin' })
      });
    });

    it('should throw BadRequest for invalid role', async () => {
      mockReq.body = {
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
      };

      await SuperAdminController.routeCreateAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Role must be admin or superadmin' })
      );
    });
  });

  describe('routeDeleteUser', () => {
    it('should delete user successfully', async () => {
      mockReq.params = { id: '2' };
      const mockUser = { 
        id: 2, 
        role: 'user',
        destroy: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);

      await SuperAdminController.routeDeleteUser(mockReq, mockRes, mockNext);

      expect(mockUser.destroy).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'User deleted successfully'
      });
    });

    it('should throw NotFound when user not found', async () => {
      mockReq.params = { id: '999' };
      User.findByPk.mockResolvedValue(null);

      await SuperAdminController.routeDeleteUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'User not found' })
      );
    });

    it('should throw BadRequest when trying to delete own account', async () => {
      mockReq.params = { id: '1' };
      const mockUser = { id: 1, role: 'superadmin' };
      User.findByPk.mockResolvedValue(mockUser);

      await SuperAdminController.routeDeleteUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Cannot delete your own account' })
      );
    });

    it('should throw BadRequest when trying to delete superadmin', async () => {
      mockReq.params = { id: '2' };
      const mockUser = { id: 2, role: 'superadmin' };
      User.findByPk.mockResolvedValue(mockUser);

      await SuperAdminController.routeDeleteUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Cannot delete superadmin accounts' })
      );
    });
  });

  describe('routeGetAllOrders', () => {
    it('should return paginated orders', async () => {
      mockReq.query = { page: 1, limit: 10 };
      const mockOrders = [{ id: 1, total_amount: 50000 }];
      Order.findAndCountAll.mockResolvedValue({ count: 1, rows: mockOrders });

      await SuperAdminController.routeGetAllOrders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: {
          orders: mockOrders,
          pagination: expect.any(Object)
        }
      });
    });

    it('should filter by status', async () => {
      mockReq.query = { status: 'Menunggu' };
      Order.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await SuperAdminController.routeGetAllOrders(mockReq, mockRes, mockNext);

      expect(Order.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe('routeUpdateOrderStatus', () => {
    it('should update order status successfully', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { order_status: 'Diproses' };
      const mockOrder = { 
        id: 1, 
        order_status: 'Menunggu',
        update: jest.fn().mockResolvedValue(true)
      };
      Order.findByPk.mockResolvedValue(mockOrder);

      await SuperAdminController.routeUpdateOrderStatus(mockReq, mockRes, mockNext);

      expect(mockOrder.update).toHaveBeenCalledWith({ order_status: 'Diproses' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should update payment status', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { payment_status: 'Lunas' };
      const mockOrder = { 
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };
      Order.findByPk.mockResolvedValue(mockOrder);

      await SuperAdminController.routeUpdateOrderStatus(mockReq, mockRes, mockNext);

      expect(mockOrder.update).toHaveBeenCalledWith({ payment_status: 'Lunas' });
    });

    it('should throw NotFound when order not found', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { order_status: 'Diproses' };
      Order.findByPk.mockResolvedValue(null);

      await SuperAdminController.routeUpdateOrderStatus(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Order not found' })
      );
    });
  });
});
