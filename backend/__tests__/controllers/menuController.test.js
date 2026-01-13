const { MenuController } = require('../../controllers/menuControllers');

// Mock models
jest.mock('../../models', () => ({
  Menu_Item: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Category: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Sequelize: {
    literal: jest.fn(() => 'random()')
  }
}));

// Mock cloudinary
jest.mock('cloudinary', () => ({
  config: jest.fn(),
  v2: {
    uploader: {
      upload: jest.fn()
    }
  }
}));

const { Menu_Item, Category } = require('../../models');

describe('MenuController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      query: {},
      file: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('routeGetMenu', () => {
    it('should return all menu items successfully', async () => {
      const mockMenuItems = [
        { id: 1, name: 'Rendang', price: 50000 },
        { id: 2, name: 'Sate Padang', price: 40000 }
      ];
      Menu_Item.findAll.mockResolvedValue(mockMenuItems);

      await MenuController.routeGetMenu(mockReq, mockRes, mockNext);

      expect(Menu_Item.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']],
        include: {
          model: Category,
          attributes: ['id', 'name']
        }
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Get All Menu',
        data: mockMenuItems
      });
    });

    it('should call next with error when database fails', async () => {
      const error = new Error('Database error');
      Menu_Item.findAll.mockRejectedValue(error);

      await MenuController.routeGetMenu(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('routeGetMenuRandom', () => {
    it('should return 4 random menu items', async () => {
      const mockMenuItems = [
        { id: 1, name: 'Rendang' },
        { id: 2, name: 'Sate Padang' },
        { id: 3, name: 'Gulai Ayam' },
        { id: 4, name: 'Dendeng Balado' }
      ];
      Menu_Item.findAll.mockResolvedValue(mockMenuItems);

      await MenuController.routeGetMenuRandom(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Get All Menu Random',
        data: mockMenuItems
      });
    });
  });

  describe('routeGetMenuLimit', () => {
    it('should return limited menu items (8)', async () => {
      const mockMenuItems = Array(8).fill({ id: 1, name: 'Menu Item' });
      Menu_Item.findAll.mockResolvedValue(mockMenuItems);

      await MenuController.routeGetMenuLimit(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Get All Menu',
        data: mockMenuItems
      });
    });
  });

  describe('routeGetMenuById', () => {
    it('should return menu item by id', async () => {
      mockReq.params = { id: 1 };
      const mockMenuItem = { id: 1, name: 'Rendang', price: 50000 };
      Menu_Item.findOne.mockResolvedValue(mockMenuItem);

      await MenuController.routeGetMenuById(mockReq, mockRes, mockNext);

      expect(Menu_Item.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Get Menu By Id',
        data: mockMenuItem
      });
    });

    it('should throw NotFound when menu item not found', async () => {
      mockReq.params = { id: 999 };
      Menu_Item.findOne.mockResolvedValue(null);

      await MenuController.routeGetMenuById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Menu Not Found' })
      );
    });
  });

  describe('routeGetCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Main Course' },
        { id: 2, name: 'Beverages' }
      ];
      Category.findAll.mockResolvedValue(mockCategories);

      await MenuController.routeGetCategories(mockReq, mockRes, mockNext);

      expect(Category.findAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Get All Categories',
        data: mockCategories
      });
    });
  });

  describe('routeGetCategoryById', () => {
    it('should return category by id', async () => {
      mockReq.params = { id: '1' };
      const mockCategory = { id: 1, name: 'Main Course' };
      Category.findByPk.mockResolvedValue(mockCategory);

      await MenuController.routeGetCategoryById(mockReq, mockRes, mockNext);

      expect(Category.findByPk).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Get Category By Id',
        data: mockCategory
      });
    });

    it('should throw NotFound when category not found', async () => {
      mockReq.params = { id: '999' };
      Category.findByPk.mockResolvedValue(null);

      await MenuController.routeGetCategoryById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Category Not Found' })
      );
    });
  });

  describe('routeCreateMenu', () => {
    it('should throw BadRequest when image is missing', async () => {
      mockReq.body = { name: 'Test Menu' };
      mockReq.file = null;

      await MenuController.routeCreateMenu(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Image is required' })
      );
    });
  });

  describe('routeAddCategory', () => {
    it('should create a new category', async () => {
      mockReq.body = { name: 'Desserts', description: 'Sweet treats' };
      Category.create.mockResolvedValue({ id: 1, name: 'Desserts', description: 'Sweet treats' });

      await MenuController.routeAddCategory(mockReq, mockRes, mockNext);

      expect(Category.create).toHaveBeenCalledWith({
        name: 'Desserts',
        description: 'Sweet treats'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should throw BadRequest when name is missing', async () => {
      mockReq.body = { description: 'Sweet treats' };

      await MenuController.routeAddCategory(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Name is required' })
      );
    });
  });

  describe('routeEditCategory', () => {
    it('should update category successfully', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Category', description: 'Updated description' };
      Category.findByPk.mockResolvedValue({ id: 1, name: 'Old Category' });
      Category.update.mockResolvedValue([1]);

      await MenuController.routeEditCategory(mockReq, mockRes, mockNext);

      expect(Category.update).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should throw NotFound when category not found', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { name: 'Updated Category', description: 'Updated description' };
      Category.findByPk.mockResolvedValue(null);

      await MenuController.routeEditCategory(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Category Not Found' })
      );
    });
  });

  describe('routeDeteleCategory', () => {
    it('should delete category successfully', async () => {
      mockReq.params = { id: '1' };
      Category.findByPk.mockResolvedValue({ id: 1, name: 'Test Category' });
      Category.destroy.mockResolvedValue(1);

      await MenuController.routeDeteleCategory(mockReq, mockRes, mockNext);

      expect(Category.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should throw NotFound when category not found', async () => {
      mockReq.params = { id: '999' };
      Category.findByPk.mockResolvedValue(null);

      await MenuController.routeDeteleCategory(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Category Not Found' })
      );
    });
  });
});
