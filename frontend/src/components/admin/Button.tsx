import { ReactNode } from "react"

const Button = ({ 
    children, 
    type = "button",
    variant = "primary", 
    size = "md", 
    onClick, 
    disabled = false,
    className = "",
    ...props 
  }: {
    children: ReactNode,
    type?: "button" | "submit" | "reset",
    variant?: "primary" | "secondary" | "danger" | "ghost",
    size?: "sm" | "md" | "lg",
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean,
    className?: string
  }) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    const variants = {
      primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    }
    
    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...props}
      >
        {children}
      </button>
    )
  }

  export default Button