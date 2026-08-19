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
                        w-full h-12 pl-11 pr-10
                        bg-[#242424] text-[#ededed] text-sm md:text-base font-medium
                        rounded-full border border-transparent
                        placeholder:text-[#888888] placeholder:font-normal
                        hover:bg-[#2a2a2a] hover:border-[#333333]
                        focus:bg-[#2a2a2a] focus:border-[#555555] focus:outline-none focus:ring-1 focus:ring-[#555555]
                        transition-all duration-200
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
