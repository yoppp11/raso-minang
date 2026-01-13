const { CartController } = require('../../controllers/cartController');

// Mock models
jest.mock('../../models/', () => ({
  User: {},
  Cart: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  },
  Cart_Item: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn()
  },
  Menu_Item: {},
  Category: {}
}));

const { Cart, Cart_Item } = require('../../models/');

describe('CartController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('routeAddCart', () => {
    it('should add new item to cart', async () => {
      mockReq.body = { menu_item_id: 1, quantity: 2 };
      Cart.findAll.mockResolvedValue([]);
      Cart.create.mockResolvedValue({ id: 1 });
      Cart_Item.create.mockResolvedValue({ id: 1 });

      await CartController.routeAddCart(mockReq, mockRes, mockNext);

      expect(Cart.create).toHaveBeenCalledWith({ user_id: 1 });
      expect(Cart_Item.create).toHaveBeenCalledWith({
        cart_id: 1,
        menu_item_id: 1,
        quantity: 2
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Success added to cart' });
    });

    it('should increment quantity if item already in cart', async () => {
      mockReq.body = { menu_item_id: 1, quantity: 2 };
      Cart.findAll.mockResolvedValue([
        { Cart_Items: [{ menu_item_id: 1 }] }
      ]);
      Cart.findOne.mockResolvedValue({ id: 1 });
      Cart_Item.increment.mockResolvedValue([1]);

      await CartController.routeAddCart(mockReq, mockRes, mockNext);

      expect(Cart_Item.increment).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Success updated stock' });
    });

    it('should call next on error', async () => {
      mockReq.body = { menu_item_id: 1, quantity: 2 };
      const error = new Error('Database error');
      Cart.findAll.mockRejectedValue(error);

      await CartController.routeAddCart(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('routeGetCart', () => {
    it('should return cart items', async () => {
      const mockCartData = [
        { Cart_Items: [{ id: 1, menu_item_id: 1, quantity: 2 }] },
        { Cart_Items: [{ id: 2, menu_item_id: 2, quantity: 1 }] }
      ];
      Cart.findAll.mockResolvedValue(mockCartData);

      await CartController.routeGetCart(mockReq, mockRes, mockNext);

      expect(Cart.findAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith([
        { id: 1, menu_item_id: 1, quantity: 2 },
        { id: 2, menu_item_id: 2, quantity: 1 }
      ]);
    });
  });

  describe('routeRemoveCart', () => {
    it('should remove cart successfully', async () => {
      mockReq.params = { cartId: '1' };
      Cart.findOne.mockResolvedValue({ id: 1 });
      Cart_Item.destroy.mockResolvedValue(1);
      Cart.destroy.mockResolvedValue(1);

      await CartController.routeRemoveCart(mockReq, mockRes, mockNext);

      expect(Cart_Item.destroy).toHaveBeenCalledWith({ where: { cart_id: 1 } });
      expect(Cart.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Succes deleted cart' });
    });

    it('should throw NotFound when cart not found', async () => {
      mockReq.params = { cartId: '999' };
      Cart.findOne.mockResolvedValue(null);

      await CartController.routeRemoveCart(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Cart not found' })
      );
    });
  });

  describe('routeIncrementStock', () => {
    it('should increment cart item quantity', async () => {
      mockReq.params = { cartId: '1' };
      Cart.findOne.mockResolvedValue({ id: 1 });
      Cart_Item.increment.mockResolvedValue([1]);

      await CartController.routeIncrementStock(mockReq, mockRes, mockNext);

      expect(Cart_Item.increment).toHaveBeenCalledWith('quantity', {
        by: 1,
        where: { cart_id: 1 }
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ message: 'Success added quantity' });
    });

    it('should throw NotFound when cart not found', async () => {
      mockReq.params = { cartId: '999' };
      Cart.findOne.mockResolvedValue(null);

      await CartController.routeIncrementStock(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Cart not found' })
      );
    });
  });
});
