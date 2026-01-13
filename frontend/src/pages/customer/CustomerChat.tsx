import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, User } from "lucide-react"
import { useNavigate } from "react-router"
import { http } from "../../helpers/axios"
import socketService from "../../helpers/socket"
import { Conversation, Message } from "../../types"
import Navbar from "../../components/customer/Navbar"
import Footer from "../../components/customer/Footer"

export default function CustomerChat() {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [typing, setTyping] = useState(false)
    const [_typingUser, setTypingUser] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const navigate = useNavigate()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (!token) {
            navigate('/login')
            return
        }
        initializeChat()
        initializeSocket()

        return () => {
            socketService.offReceiveMessage()
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return 'Hari Ini'
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Kemarin'
        } else {
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        }
    }

    // Group messages by date
    const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
        const date = new Date(message.createdAt).toDateString()
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(message)
        return groups
    }, {})

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chat dengan Admin</h1>
                            <p className="text-sm text-gray-600">Tanyakan apa saja tentang pesanan atau menu</p>
                        </div>
                    </div>

                    {/* Chat Container */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Chat Header */}
                        <div className="bg-green-600 text-white p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Raso Minang Support</h3>
                                    <p className="text-xs text-green-100">Kami siap membantu Anda!</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <User className="h-16 w-16 mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">Belum ada pesan</p>
                                    <p className="text-sm">Mulai chat dengan admin kami</p>
                                </div>
                            ) : (
                                Object.entries(groupedMessages).map(([date, msgs]) => (
                                    <div key={date}>
                                        <div className="flex justify-center my-4">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                {formatDate(msgs[0].createdAt)}
                                            </span>
                                        </div>
                                        {msgs.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex mb-4 ${
                                                    message.sender_role === 'user' ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                                                        message.sender_role === 'user'
                                                            ? 'bg-green-600 text-white rounded-br-md'
                                                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                                    }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                                                        message.sender_role === 'user' ? 'text-green-100' : 'text-gray-400'
                                                    }`}>
                                                        <span className="text-xs">{formatTime(message.createdAt)}</span>
                                                        {message.sender_role === 'user' && message.is_read && (
                                                            <span className="text-xs">✓✓</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                            {typing && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-gray-100 p-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value)
                                        handleTyping()
                                    }}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ketik pesan..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
