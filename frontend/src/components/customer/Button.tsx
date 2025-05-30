import { ButtonProps } from "../../types";

const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    onClick, 
    className = '',
    disabled = false 
  }) => {
    const baseClasses = "font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      outline: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500"
    };
    
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };
    
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;