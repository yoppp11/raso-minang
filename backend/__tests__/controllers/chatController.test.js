const { ChatController } = require('../../controllers/chatController');

// Mock models
jest.mock('../../models', () => ({
  Conversation: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  Message: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn()
  },
  User: {},
  Op: {
    ne: Symbol('ne')
  }
}));

const { Conversation, Message } = require('../../models');

describe('ChatController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { id: 1, role: 'user' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('routeGetConversations', () => {
    it('should return all conversations with unread count', async () => {
      const mockConversations = [
        { id: 1, user_id: 1, toJSON: () => ({ id: 1, user_id: 1 }) },
        { id: 2, user_id: 2, toJSON: () => ({ id: 2, user_id: 2 }) }
      ];
      Conversation.findAll.mockResolvedValue(mockConversations);
      Message.count.mockResolvedValue(3);

      await ChatController.routeGetConversations(mockReq, mockRes, mockNext);

      expect(Conversation.findAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: expect.any(Array)
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      Conversation.findAll.mockRejectedValue(error);

      await ChatController.routeGetConversations(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('routeGetConversationById', () => {
    it('should return conversation by id', async () => {
      mockReq.params = { id: '1' };
      const mockConversation = { id: 1, user_id: 1, Messages: [] };
      Conversation.findOne.mockResolvedValue(mockConversation);

      await ChatController.routeGetConversationById(mockReq, mockRes, mockNext);

      expect(Conversation.findOne).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: mockConversation
      });
    });

    it('should throw NotFound when conversation not found', async () => {
      mockReq.params = { id: '999' };
      Conversation.findOne.mockResolvedValue(null);

      await ChatController.routeGetConversationById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Conversation not found' })
      );
    });
  });

  describe('routeGetUserConversation', () => {
    it('should return user conversation', async () => {
      const mockConversation = { id: 1, user_id: 1, Messages: [] };
      Conversation.findOne.mockResolvedValue(mockConversation);

      await ChatController.routeGetUserConversation(mockReq, mockRes, mockNext);

      expect(Conversation.findOne).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: mockConversation
      });
    });

    it('should return null when user has no conversation', async () => {
      Conversation.findOne.mockResolvedValue(null);

      await ChatController.routeGetUserConversation(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: null
      });
    });
  });

  describe('routeCreateConversation', () => {
    it('should return existing conversation if found', async () => {
      const mockConversation = { id: 1, user_id: 1, status: 'active' };
      Conversation.findOne.mockResolvedValue(mockConversation);

      await ChatController.routeCreateConversation(mockReq, mockRes, mockNext);

      expect(Conversation.create).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: mockConversation
      });
    });

    it('should create new conversation if not exists', async () => {
      const newConversation = { id: 1, user_id: 1, status: 'active' };
      Conversation.findOne.mockResolvedValue(null);
      Conversation.create.mockResolvedValue(newConversation);

      await ChatController.routeCreateConversation(mockReq, mockRes, mockNext);

      expect(Conversation.create).toHaveBeenCalledWith({
        user_id: 1,
        status: 'active'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('routeSendMessage', () => {
    it('should send message successfully', async () => {
      mockReq.body = { conversationId: 1, content: 'Hello!' };
      const mockConversation = { 
        id: 1, 
        update: jest.fn().mockResolvedValue(true) 
      };
      const mockMessage = { id: 1, content: 'Hello!' };
      const fullMessage = { id: 1, content: 'Hello!', Sender: { id: 1, username: 'test' } };
      
      Conversation.findByPk.mockResolvedValue(mockConversation);
      Message.create.mockResolvedValue(mockMessage);
      Message.findByPk.mockResolvedValue(fullMessage);

      await ChatController.routeSendMessage(mockReq, mockRes, mockNext);

      expect(Message.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: fullMessage
      });
    });

    it('should throw BadRequest when content is missing', async () => {
      mockReq.body = { conversationId: 1 };

      await ChatController.routeSendMessage(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest', message: 'Content and conversationId are required' })
      );
    });

    it('should throw BadRequest when conversationId is missing', async () => {
      mockReq.body = { content: 'Hello!' };

      await ChatController.routeSendMessage(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'BadRequest' })
      );
    });

    it('should throw NotFound when conversation not found', async () => {
      mockReq.body = { conversationId: 999, content: 'Hello!' };
      Conversation.findByPk.mockResolvedValue(null);

      await ChatController.routeSendMessage(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Conversation not found' })
      );
    });
  });

  describe('routeMarkAsRead', () => {
    it('should mark messages as read for user', async () => {
      mockReq.params = { conversationId: '1' };
      mockReq.user = { id: 1, role: 'user' };
      Message.update.mockResolvedValue([5]);

      await ChatController.routeMarkAsRead(mockReq, mockRes, mockNext);

      expect(Message.update).toHaveBeenCalledWith(
        { is_read: true },
        {
          where: {
            conversation_id: '1',
            sender_role: 'superadmin',
            is_read: false
          }
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Messages marked as read'
      });
    });

    it('should mark messages as read for superadmin', async () => {
      mockReq.params = { conversationId: '1' };
      mockReq.user = { id: 1, role: 'superadmin' };
      Message.update.mockResolvedValue([3]);

      await ChatController.routeMarkAsRead(mockReq, mockRes, mockNext);

      expect(Message.update).toHaveBeenCalledWith(
        { is_read: true },
        {
          where: {
            conversation_id: '1',
            sender_role: 'user',
            is_read: false
          }
        }
      );
    });
  });

  describe('routeGetUnreadCount', () => {
    it('should return unread count', async () => {
      Message.count.mockResolvedValue(5);

      await ChatController.routeGetUnreadCount(mockReq, mockRes, mockNext);

      expect(Message.count).toHaveBeenCalledWith({
        where: {
          is_read: false,
          sender_role: 'user'
        }
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: { unreadCount: 5 }
      });
    });

    it('should return zero when no unread messages', async () => {
      Message.count.mockResolvedValue(0);

      await ChatController.routeGetUnreadCount(mockReq, mockRes, mockNext);

      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        data: { unreadCount: 0 }
      });
    });
  });

  describe('routeCloseConversation', () => {
    it('should close conversation successfully', async () => {
      mockReq.params = { id: '1' };
      const mockConversation = { 
        id: 1, 
        update: jest.fn().mockResolvedValue(true) 
      };
      Conversation.findByPk.mockResolvedValue(mockConversation);

      await ChatController.routeCloseConversation(mockReq, mockRes, mockNext);

      expect(mockConversation.update).toHaveBeenCalledWith({ status: 'closed' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'Conversation closed'
      });
    });

    it('should throw NotFound when conversation not found', async () => {
      mockReq.params = { id: '999' };
      Conversation.findByPk.mockResolvedValue(null);

      await ChatController.routeCloseConversation(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'NotFound', message: 'Conversation not found' })
      );
    });
  });
});
