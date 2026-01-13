require('dotenv').config()

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 
const cors = require('cors')
const { router } = require('./routers')
const { errorHandler } = require('./middlewares/errorMiddleware')
const { verifyToken } = require('./helpers/jwt')
const { User, Conversation, Message } = require('./models')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
const port = 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use('/', router)
app.use(errorHandler)

// Store connected users
const connectedUsers = new Map()

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token
        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return next(new Error('Invalid token'))
        }

        const user = await User.findOne({
            where: { email: decoded.email }
        })

        if (!user) {
            return next(new Error('User not found'))
        }

        socket.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        }
        next()
    } catch (error) {
        next(new Error('Authentication error'))
    }
})

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user.role})`)
    
    // Store user connection
    connectedUsers.set(socket.user.id, socket.id)

    // Join user to their own room
    socket.join(`user_${socket.user.id}`)

    // If superadmin, join admin room
    if (socket.user.role === 'superadmin') {
        socket.join('superadmin_room')
        console.log(`Super admin ${socket.user.username} joined admin room`)
    }

    // Join conversation room
    socket.on('join_conversation', async (conversationId) => {
        socket.join(`conversation_${conversationId}`)
        console.log(`${socket.user.username} joined conversation ${conversationId}`)
    })

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`)
        console.log(`${socket.user.username} left conversation ${conversationId}`)
    })

    // Handle new message
    socket.on('send_message', async (data) => {
        try {
            const { conversationId, content } = data
            
            // Save message to database
            const message = await Message.create({
                conversation_id: conversationId,
                sender_id: socket.user.id,
                sender_role: socket.user.role,
                content,
                is_read: false
            })

            // Update conversation
            await Conversation.update(
                {
                    last_message: content,
                    last_message_at: new Date()
                },
                { where: { id: conversationId } }
            )

            // Get full message with sender info
            const fullMessage = await Message.findByPk(message.id, {
                include: [{
                    model: User,
                    as: 'Sender',
                    attributes: ['id', 'username', 'full_name', 'role']
                }]
            })

            // Emit to conversation room
            io.to(`conversation_${conversationId}`).emit('receive_message', fullMessage)

            // If message is from user, notify superadmins
            if (socket.user.role === 'user') {
                io.to('superadmin_room').emit('new_message_notification', {
                    conversationId,
                    message: fullMessage
                })
            }

            // If message is from superadmin, notify the user
            if (socket.user.role === 'superadmin') {
                const conversation = await Conversation.findByPk(conversationId)
                if (conversation) {
                    io.to(`user_${conversation.user_id}`).emit('receive_message', fullMessage)
                }
            }
        } catch (error) {
            console.error('Error sending message:', error)
            socket.emit('error', { message: 'Failed to send message' })
        }
    })

    // Handle typing indicator
    socket.on('typing', (data) => {
        const { conversationId, isTyping } = data
        socket.to(`conversation_${conversationId}`).emit('user_typing', {
            userId: socket.user.id,
            username: socket.user.username,
            isTyping
        })
    })

    // Handle mark as read
    socket.on('mark_as_read', async (data) => {
        try {
            const { conversationId } = data
            const targetRole = socket.user.role === 'superadmin' ? 'user' : 'superadmin'

            await Message.update(
                { is_read: true },
                {
                    where: {
                        conversation_id: conversationId,
                        sender_role: targetRole,
                        is_read: false
                    }
                }
            )

            io.to(`conversation_${conversationId}`).emit('messages_read', {
                conversationId,
                readBy: socket.user.id
            })
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.username}`)
        connectedUsers.delete(socket.user.id)
    })
})

server.listen(port, ()=> {
    console.log('menyala abangda', port);
})

module.exports = {
    app,
    upload,
    io
}