import { LucideIcon } from "lucide-react";

export default function Input({ label, icon: Icon, value, placeholder, error, className = "", ...props }: {
    label?: string,
    icon?: LucideIcon,
    error?: string,
    value?: string | number,
    placeholder?: string,
    className?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}){
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${error ? 'border-red-300' : ''}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}