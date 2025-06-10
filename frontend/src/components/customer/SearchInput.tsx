import { Search, X } from "lucide-react";
  import { useState } from "react";
  
  interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }
  
  export function SearchInput({ value, onChange, placeholder = "Cari menu...", className = "" }: SearchInputProps) {
    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }