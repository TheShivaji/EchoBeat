import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import type { Artist } from "../../artists/types/artists.types";

interface ArtistSelectorProps {
    artists: Artist[];
    loading: boolean;
    selectedArtistId: string;
    onChange: (artistId: string) => void;
    disabled?: boolean;
}

export const ArtistSelector: React.FC<ArtistSelectorProps> = ({
    artists,
    loading,
    selectedArtistId,
    onChange,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedArtist = artists.find(a => a.id === selectedArtistId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
    };

    const getDisplayText = () => {
        if (loading) return "Loading artists...";
        if (selectedArtist) return selectedArtist.name;
        return "Select artist";
    };

    const isDisabled = disabled || loading;

    return (
        <div className="flex flex-col gap-1.5" ref={dropdownRef}>
            <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#ededed]">
                    Artist
                </label>
                <Link 
                    to="/create-artist" 
                    className="text-[12px] text-[#888888] hover:text-[#ededed] transition-colors"
                >
                    + Create Artist
                </Link>
            </div>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => !isDisabled && setIsOpen(!isOpen)}
                    disabled={isDisabled}
                    className={`
                        w-full flex items-center justify-between
                        px-3.5 py-2.5 rounded-lg border text-[14px]
                        transition-all duration-200 text-left
                        ${isDisabled 
                            ? "bg-[#161616] border-[#222222] text-[#666666] cursor-not-allowed" 
                            : "bg-[#161616] border-[#222222] text-[#ededed] hover:border-[#444444] focus:border-[#666666] focus:outline-none"
                        }
                    `}
                >
                    <span className={!selectedArtist && !loading ? "text-[#666666]" : "text-[#ededed]"}>
                        {getDisplayText()}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#666666] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#171717] border border-[#222222] rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                        {artists.length === 0 ? (
                            <div className="px-3.5 py-3 text-[13px] text-[#888888] text-center">
                                No artists available
                            </div>
                        ) : (
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {artists.map((artist) => (
                                    <button
                                        key={artist.id}
                                        type="button"
                                        onClick={() => handleSelect(artist.id)}
                                        className={`
                                            w-full flex items-center justify-between
                                            px-3.5 py-2.5 text-[14px] text-left transition-colors
                                            ${selectedArtistId === artist.id 
                                                ? "bg-[#222222] text-[#ededed]" 
                                                : "text-[#888888] hover:bg-[#222222] hover:text-[#ededed]"
                                            }
                                        `}
                                    >
                                        <span>{artist.name}</span>
                                        {selectedArtistId === artist.id && (
                                            <Check className="w-4 h-4 text-[#ededed]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
