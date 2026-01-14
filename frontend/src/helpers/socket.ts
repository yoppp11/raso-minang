import { io, Socket } from 'socket.io-client'
import { Message } from '../types'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface TypingData {
    userId: number
    username: string
    isTyping: boolean
}

interface MessagesReadData {
    conversationId: number
    readBy: number
}

interface NewMessageNotification {
    conversationId: number
    message: Message
}

class SocketService {
    private socket: Socket | null = null
    private static instance: SocketService

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService()
        }
        return SocketService.instance
    }

    public connect(token: string): Socket {
        if (this.socket?.connected) {
            return this.socket
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling']
        })

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id)
        })

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason)
        })

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message)
        })

        return this.socket
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    public getSocket(): Socket | null {
        return this.socket
    }

    public isConnected(): boolean {
        return this.socket?.connected || false
    }

    // Chat specific methods
    public joinConversation(conversationId: number): void {
        this.socket?.emit('join_conversation', conversationId)
    }

    public leaveConversation(conversationId: number): void {
        this.socket?.emit('leave_conversation', conversationId)
    }

    public sendMessage(conversationId: number, content: string): void {
        this.socket?.emit('send_message', { conversationId, content })
    }

    public sendTypingStatus(conversationId: number, isTyping: boolean): void {
        this.socket?.emit('typing', { conversationId, isTyping })
    }

    public markAsRead(conversationId: number): void {
        this.socket?.emit('mark_as_read', { conversationId })
    }

    // Event listeners with proper types
    public onReceiveMessage(callback: (message: Message) => void): void {
        this.socket?.on('receive_message', callback)
    }

    public onNewMessageNotification(callback: (data: NewMessageNotification) => void): void {
        this.socket?.on('new_message_notification', callback)
    }

    public onUserTyping(callback: (data: TypingData) => void): void {
        this.socket?.on('user_typing', callback)
    }

    public onMessagesRead(callback: (data: MessagesReadData) => void): void {
        this.socket?.on('messages_read', callback)
    }

    public offReceiveMessage(): void {
        this.socket?.off('receive_message')
    }

    public offNewMessageNotification(): void {
        this.socket?.off('new_message_notification')
    }

    public offUserTyping(): void {
        this.socket?.off('user_typing')
    }

    public offMessagesRead(): void {
        this.socket?.off('messages_read')
    }
}

export default SocketService.getInstance()
