import React from "react";
import { Search, X } from "lucide-react";
import type { SearchInputProps } from "../types/search.types";

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onSubmit,
    placeholder = "What do you want to listen to?",
    autoFocus = false
}) => {
    const handleClear = () => {
        onChange("");
    };

    return (
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
            }} 
            className="w-full max-w-[400px] relative"
        >
            <div className="relative flex items-center w-full">
                <Search 
                    className="absolute left-3.5 text-[#888888] w-5 h-5" 
                    strokeWidth={2}
                />
                
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="
                        w-full h-14 pl-12 pr-12
                        bg-[#121212] text-white text-[15px] font-medium
                        rounded-full border border-[#222] shadow-sm
                        placeholder:text-[#888888] placeholder:font-normal
                        hover:bg-[#161616] hover:border-[#333]
                        focus:bg-[#1a1a1a] focus:border-[#444] focus:outline-none focus:ring-4 focus:ring-white/5
                        transition-all duration-300 ease-out
                    "
                />
                
                {value.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="
                            absolute right-3.5 text-[#888888] hover:text-[#ededed] 
                            transition-colors duration-200 p-1
                        "
                        aria-label="Clear search"
                    >
                        <X className="w-5 h-5" strokeWidth={2} />
                    </button>
                )}
            </div>
        </form>
    );
};
