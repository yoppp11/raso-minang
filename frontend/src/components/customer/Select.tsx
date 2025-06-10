import { ChevronDown } from "lucide-react";
  
  interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
  }
  
  export function Select({ value, onChange, options, placeholder = "Pilih...", className = "" }: SelectProps) {
    return (
      <div className={`relative ${className}`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
      </div>
    );
  }