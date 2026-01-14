import { useState, useEffect, useRef } from "react"
import { Search, Send, User, MessageSquare, CheckCheck, X } from "lucide-react"
import { http } from "../../helpers/axios"
import socketService from "../../helpers/socket"
import { Conversation, Message } from "../../types"

export default function SuperAdminChat() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [typing, setTyping] = useState(false)
    const [typingUser, setTypingUser] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        fetchConversations()
        initializeSocket()

        return () => {
            socketService.offReceiveMessage()
            socketService.offNewMessageNotification()
            socketService.offUserTyping()
            socketService.offMessagesRead()
        }
    }, [])

    const initializeSocket = () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            socketService.connect(token)

            socketService.onReceiveMessage((message: Message) => {
                setMessages(prev => [...prev, message])
                // Update conversation list
                setConversations(prev => prev.map(conv => {
                    if (conv.id === message.conversation_id) {
                        return {
                            ...conv,
                            last_message: message.content,
                            last_message_at: message.createdAt
                        }
                    }
                    return conv
                }))
            })

            socketService.onNewMessageNotification((data) => {
                // Update unread count in conversation list
                setConversations(prev => prev.map(conv => {
                    if (conv.id === data.conversationId) {
                        return {
                            ...conv,
                            last_message: data.message.content,
                            last_message_at: data.message.createdAt,
                            unreadCount: (conv.unreadCount || 0) + 1
                        }
                    }
                    return conv
                }))
            })

            socketService.onUserTyping((data) => {
                if (data.isTyping) {
                    setTypingUser(data.username)
                    setTyping(true)
                } else {
                    setTyping(false)
                }
            })

            socketService.onMessagesRead(() => {
                setMessages(prev => prev.map(m => ({ ...m, is_read: true })))
            })
        }
    }

    const fetchConversations = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('access_token')
            const response = await http({
                method: 'get',
                url: '/chat/conversations',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setConversations(response.data.data)
        } catch (error) {
            console.error('Error fetching conversations:', error)
        } finally {
            setLoading(false)
        }
    }

    const selectConversation = async (conversation: Conversation) => {
        try {
            setMessagesLoading(true)
            setSelectedConversation(conversation)

            const token = localStorage.getItem('access_token')
            const response = await http({
                method: 'get',
                url: `/chat/conversations/${conversation.id}`,
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setMessages(response.data.data.Messages || [])

            // Join conversation room
            socketService.joinConversation(conversation.id)

            // Mark messages as read
            socketService.markAsRead(conversation.id)

            // Update local unread count
            setConversations(prev => prev.map(conv => {
                if (conv.id === conversation.id) {
                    return { ...conv, unreadCount: 0 }
                }
                return conv
            }))
        } catch (error) {
            console.error('Error loading messages:', error)
        } finally {
            setMessagesLoading(false)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return

        const messageContent = newMessage.trim()
        setNewMessage("")

        try {
            // Send via socket - backend will save to database
            socketService.sendMessage(selectedConversation.id, messageContent)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const handleTyping = () => {
        if (!selectedConversation) return

        socketService.sendTypingStatus(selectedConversation.id, true)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketService.sendTypingStatus(selectedConversation.id, false)
        }, 2000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = (dateString: string | null) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return formatTime(dateString)
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday'
        } else {
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        }
    }

    const filteredConversations = conversations.filter(conv =>
        conv.User?.username?.toLowerCase().includes(search.toLowerCase()) ||
        conv.User?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        conv.User?.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden">
            {/* Conversations List */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                            <MessageSquare className="h-8 w-8 mb-2 text-gray-300" />
                            <p className="text-sm">No conversations</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => selectConversation(conv)}
                                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                                    selectedConversation?.id === conv.id
                                        ? 'bg-orange-50 border-l-4 border-l-orange-600'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-gray-900 truncate">
                                                {conv.User?.full_name || conv.User?.username || 'Unknown User'}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(conv.last_message_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate mt-1">
                                            {conv.last_message || 'No messages yet'}
                                        </p>
                                    </div>
                                    {conv.unreadCount && conv.unreadCount > 0 && (
                                        <span className="bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {selectedConversation.User?.full_name || selectedConversation.User?.username}
                                    </p>
                                    <p className="text-sm text-gray-500">{selectedConversation.User?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    socketService.leaveConversation(selectedConversation.id)
                                    setSelectedConversation(null)
                                    setMessages([])
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messagesLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <MessageSquare className="h-12 w-12 mb-2 text-gray-300" />
                                    <p className="text-sm">No messages in this conversation</p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender_role === 'superadmin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                                    message.sender_role === 'superadmin'
                                                        ? 'bg-orange-600 text-white rounded-br-sm'
                                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                                                }`}
                                            >
                                                {message.sender_role !== 'superadmin' && (
                                                    <p className="text-xs text-gray-500 mb-1 font-medium">
                                                        {message.Sender?.full_name || message.Sender?.username}
                                                    </p>
                                                )}
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-1 ${
                                                    message.sender_role === 'superadmin' ? 'text-orange-100' : 'text-gray-400'
                                                }`}>
                                                    <span className="text-xs">{formatTime(message.createdAt)}</span>
                                                    {message.sender_role === 'superadmin' && (
                                                        <CheckCheck className={`h-3 w-3 ${message.is_read ? 'text-white' : 'text-orange-200'}`} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {typing && (
                                        <div className="flex justify-start">
                                            <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-sm px-4 py-2">
                                                <p className="text-xs text-gray-500 mb-1">{typingUser}</p>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value)
                                        handleTyping()
                                    }}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Select a conversation</h3>
                        <p className="text-sm text-gray-500">Choose from your existing conversations or wait for new messages</p>
                    </div>
                )}
            </div>
        </div>
    )
}
