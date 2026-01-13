import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, X } from "lucide-react"
import { http } from "../../helpers/axios"
import socketService from "../../helpers/socket"
import { Conversation, Message } from "../../types"

interface ChatWidgetProps {
    isLoggedIn: boolean
}

export default function ChatWidget({ isLoggedIn }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)
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
        if (isLoggedIn && isOpen) {
            initializeChat()
        }
    }, [isLoggedIn, isOpen])

    useEffect(() => {
        if (!isLoggedIn) return

        const token = localStorage.getItem('access_token')
        if (token) {
            socketService.connect(token)

            socketService.onReceiveMessage((message: Message) => {
                setMessages(prev => [...prev, message])
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

        return () => {
            socketService.offReceiveMessage()
            socketService.offUserTyping()
            socketService.offMessagesRead()
        }
    }, [isLoggedIn])

    const initializeChat = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('access_token')

            // Get or create conversation
            let convResponse = await http({
                method: 'get',
                url: '/chat/my-conversation',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!convResponse.data.data) {
                convResponse = await http({
                    method: 'post',
                    url: '/chat/conversations',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            }

            const conv = convResponse.data.data
            setConversation(conv)

            if (conv) {
                // Load messages
                const messagesResponse = await http({
                    method: 'get',
                    url: `/chat/conversations/${conv.id}`,
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                setMessages(messagesResponse.data.data.Messages || [])

                // Join conversation room
                socketService.joinConversation(conv.id)

                // Mark messages as read
                socketService.markAsRead(conv.id)
            }
        } catch (error) {
            console.error('Error initializing chat:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !conversation) return

        const token = localStorage.getItem('access_token')
        const messageContent = newMessage.trim()
        setNewMessage("")

        try {
            // Send via socket for real-time
            socketService.sendMessage(conversation.id, messageContent)

            // Also save via API as backup
            await http({
                method: 'post',
                url: '/chat/messages',
                headers: { 'Authorization': `Bearer ${token}` },
                data: {
                    conversationId: conversation.id,
                    content: messageContent
                }
            })
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const handleTyping = () => {
        if (!conversation) return

        socketService.sendTypingStatus(conversation.id, true)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketService.sendTypingStatus(conversation.id, false)
        }, 2000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isLoggedIn) return null

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50 ${isOpen ? 'hidden' : ''}`}
            >
                <MessageSquare className="h-6 w-6" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Raso Minang Support</h3>
                                <p className="text-xs text-green-100">We're here to help!</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <MessageSquare className="h-12 w-12 mb-2 text-gray-300" />
                                <p className="text-sm">Start a conversation</p>
                                <p className="text-xs">Ask us anything about your order!</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                                message.sender_role === 'user'
                                                    ? 'bg-green-600 text-white rounded-br-sm'
                                                    : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                                            }`}
                                        >
                                            {message.sender_role !== 'user' && (
                                                <p className="text-xs text-gray-500 mb-1 font-medium">
                                                    Admin
                                                </p>
                                            )}
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-xs mt-1 ${
                                                message.sender_role === 'user' ? 'text-green-100' : 'text-gray-400'
                                            }`}>
                                                {formatTime(message.createdAt)}
                                                {message.sender_role === 'user' && message.is_read && (
                                                    <span className="ml-1">✓✓</span>
                                                )}
                                            </p>
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
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
