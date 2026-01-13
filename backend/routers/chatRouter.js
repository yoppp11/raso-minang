const express = require('express');
const { ChatController } = require('../controllers/chatController');
const chatRouter = express.Router();

// User routes
chatRouter.get('/my-conversation', ChatController.routeGetUserConversation);
chatRouter.post('/conversations', ChatController.routeCreateConversation);
chatRouter.post('/messages', ChatController.routeSendMessage);
chatRouter.patch('/conversations/:conversationId/read', ChatController.routeMarkAsRead);

// Admin/SuperAdmin routes
chatRouter.get('/conversations', ChatController.routeGetConversations);
chatRouter.get('/conversations/:id', ChatController.routeGetConversationById);
chatRouter.get('/messages/unread-count', ChatController.routeGetUnreadCount);
chatRouter.patch('/conversations/:id/close', ChatController.routeCloseConversation);

module.exports = { chatRouter };
