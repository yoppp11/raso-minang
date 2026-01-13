const { Conversation, Message, User } = require('../models');
const { Op } = require('sequelize');

class ChatController {
    // Get all conversations (for super admin)
    static async routeGetConversations(req, res, next) {
        try {
            const conversations = await Conversation.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'full_name', 'email']
                    }
                ],
                order: [['last_message_at', 'DESC']]
            });

            // Get unread count for each conversation
            const conversationsWithUnread = await Promise.all(
                conversations.map(async (conv) => {
                    const unreadCount = await Message.count({
                        where: {
                            conversation_id: conv.id,
                            is_read: false,
                            sender_role: 'user'
                        }
                    });
                    return {
                        ...conv.toJSON(),
                        unreadCount
                    };
                })
            );

            return res.status(200).send({
                status: 'success',
                data: conversationsWithUnread
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get conversation by ID with messages
    static async routeGetConversationById(req, res, next) {
        try {
            const { id } = req.params;
            
            const conversation = await Conversation.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'full_name', 'email']
                    },
                    {
                        model: Message,
                        include: [
                            {
                                model: User,
                                as: 'Sender',
                                attributes: ['id', 'username', 'full_name', 'role']
                            }
                        ],
                        order: [['createdAt', 'ASC']]
                    }
                ]
            });

            if (!conversation) {
                throw { name: 'NotFound', message: 'Conversation not found' };
            }

            return res.status(200).send({
                status: 'success',
                data: conversation
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get user's conversation (for customers)
    static async routeGetUserConversation(req, res, next) {
        try {
            const userId = req.user.id;

            let conversation = await Conversation.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: Message,
                        include: [
                            {
                                model: User,
                                as: 'Sender',
                                attributes: ['id', 'username', 'full_name', 'role']
                            }
                        ],
                        order: [['createdAt', 'ASC']]
                    }
                ]
            });

            return res.status(200).send({
                status: 'success',
                data: conversation
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Create or get conversation for user
    static async routeCreateConversation(req, res, next) {
        try {
            const userId = req.user.id;

            let conversation = await Conversation.findOne({
                where: { user_id: userId }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    user_id: userId,
                    status: 'active'
                });
            }

            return res.status(201).send({
                status: 'success',
                data: conversation
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Send a message
    static async routeSendMessage(req, res, next) {
        try {
            const { conversationId, content } = req.body;
            const senderId = req.user.id;
            const senderRole = req.user.role;

            if (!content || !conversationId) {
                throw { name: 'BadRequest', message: 'Content and conversationId are required' };
            }

            const conversation = await Conversation.findByPk(conversationId);
            if (!conversation) {
                throw { name: 'NotFound', message: 'Conversation not found' };
            }

            const message = await Message.create({
                conversation_id: conversationId,
                sender_id: senderId,
                sender_role: senderRole,
                content,
                is_read: false
            });

            // Update conversation's last message
            await conversation.update({
                last_message: content,
                last_message_at: new Date()
            });

            // Fetch the full message with sender info
            const fullMessage = await Message.findByPk(message.id, {
                include: [
                    {
                        model: User,
                        as: 'Sender',
                        attributes: ['id', 'username', 'full_name', 'role']
                    }
                ]
            });

            return res.status(201).send({
                status: 'success',
                data: fullMessage
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Mark messages as read
    static async routeMarkAsRead(req, res, next) {
        try {
            const { conversationId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            // Mark messages as read based on role
            // If superadmin, mark user messages as read
            // If user, mark superadmin messages as read
            const targetRole = userRole === 'superadmin' ? 'user' : 'superadmin';

            await Message.update(
                { is_read: true },
                {
                    where: {
                        conversation_id: conversationId,
                        sender_role: targetRole,
                        is_read: false
                    }
                }
            );

            return res.status(200).send({
                status: 'success',
                message: 'Messages marked as read'
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get unread message count (for super admin)
    static async routeGetUnreadCount(req, res, next) {
        try {
            const unreadCount = await Message.count({
                where: {
                    is_read: false,
                    sender_role: 'user'
                }
            });

            return res.status(200).send({
                status: 'success',
                data: { unreadCount }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Close conversation
    static async routeCloseConversation(req, res, next) {
        try {
            const { id } = req.params;

            const conversation = await Conversation.findByPk(id);
            if (!conversation) {
                throw { name: 'NotFound', message: 'Conversation not found' };
            }

            await conversation.update({ status: 'closed' });

            return res.status(200).send({
                status: 'success',
                message: 'Conversation closed'
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = { ChatController };
