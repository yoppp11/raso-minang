import React from 'react'

interface FormInputProps {
    id: string
    name: string
    type: string
    label: string
    placeholder: string
    icon: React.ReactNode
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    rightElement?: React.ReactNode
}

const FormInput: React.FC<FormInputProps> = ({
    id,
    name,
    type,
    label,
    placeholder,
    icon,
    value,
    onChange,
    required = false,
    rightElement
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={placeholder}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormInput