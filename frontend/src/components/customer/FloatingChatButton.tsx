import { MessageCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

export default function FloatingChatButton() {
    const [isVisible, setIsVisible] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        setIsVisible(!!token)
    }, [])

    const handleClick = () => {
        navigate('/chat')
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {showTooltip && (
                <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    Chat dengan Admin
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
            )}
            <button
                onClick={handleClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
                aria-label="Chat dengan Admin"
            >
                <MessageCircle size={24} />
            </button>
        </div>
    )
}
