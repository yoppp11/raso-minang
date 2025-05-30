import { InputProps } from "../../types";

export default function InputLogin({ 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    icon: Icon, 
    error, 
    required = false,
    className = ''
  }: InputProps) {
    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className={`
              w-full px-4 py-3 ${Icon ? 'pl-12' : ''} 
              border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-green-500 focus:border-transparent
              transition-all duration-200
              bg-white text-gray-900 placeholder-gray-500
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }