import { Play, Music, Plus } from "lucide-react";
import type { Song } from "../types/home.types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import AddToPlaylistModal from "../../playlist/components/AddToPlaylistModal";

interface SongCardProps {
    song: Song;
    index?: number;
    showIndex?: boolean;
    onClick?: () => void;
    variant?: "default" | "chart" | "history";
}

const SongCard = ({ 
    song, 
    index, 
    showIndex = false, 
    onClick, 
    variant = "default" 
}: SongCardProps) => {
    const navigate = useNavigate();
    const primaryArtist = song.artists[0]?.name ?? "Unknown Artist";
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic styling based on variant
    const getVariantClasses = () => {
        if (variant === "history") {
            return "bg-[#121212] border border-[#222] shadow-sm hover:bg-[#1a1a1a] hover:border-[#333] px-4 py-3 rounded-xl";
        }
        if (variant === "chart") {
            return "hover:bg-[#181818] px-3 py-2 rounded-lg";
        }
        // default
        return "hover:bg-[#181818] px-3 py-2.5 rounded-md";
    };

    const isChart = variant === "chart";
    const isHistory = variant === "history";

    return (
        <motion.div 
            onClick={onClick || (() => navigate(`/song/${song.id}`))}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`group flex items-center gap-4 transition-all duration-300 ease-out cursor-pointer ${getVariantClasses()}`}
        >

            {/* Ranking Number (only for chart or when showIndex is true and default) */}
            {isChart && index !== undefined && (
                <div className="flex-shrink-0 w-6 text-center">
                    <span className="text-[14px] font-medium text-[#666] group-hover:text-white transition-colors duration-300">
                        {(index + 1).toString().padStart(2, '0')}
                    </span>
                </div>
            )}
            {!isChart && showIndex && index !== undefined && (
                <div className="flex-shrink-0 w-5 text-right">
                    <span className="text-[12px] font-normal text-[#444] group-hover:hidden">
                        {index + 1}
                    </span>
                    <Play size={12} strokeWidth={2} className="hidden group-hover:inline-block text-white fill-white" />
                </div>
            )}

            {/* Artwork */}
            <div className={`relative flex-shrink-0 ${isHistory ? 'w-[52px] h-[52px]' : 'w-12 h-12'}`}>
                <div className={`w-full h-full overflow-hidden bg-[#1a1a1a] border border-[#222] ${isHistory ? 'rounded-md' : 'rounded-md'}`}>
                    {song.imageUrl ? (
                        <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Music size={isHistory ? 20 : 16} strokeWidth={1.5} className="text-[#444]" aria-hidden="true" />
                        </div>
                    )}
                </div>

                {/* Play overlay on hover */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHistory ? 'rounded-md' : 'rounded-md'}`}>
                    <Play size={isHistory ? 18 : 16} strokeWidth={2} className="text-white fill-white" aria-hidden="true" />
                </div>
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className={`font-semibold text-[#ededed] group-hover:text-white transition-colors duration-300 truncate leading-tight ${isHistory ? 'text-[15px]' : 'text-[14px]'}`}>
                    {song.title}
                </p>
                <p className={`mt-0.5 font-medium text-[#888] truncate leading-tight ${isHistory ? 'text-[13px]' : 'text-[12px]'}`}>
                    {primaryArtist}
                </p>
            </div>

            {/* Play count or duration */}
            {song.playCount !== undefined && !isHistory && (
                <span className="flex-shrink-0 text-[12px] font-medium text-[#666] hidden md:block">
                    {song.playCount.toLocaleString()} plays
                </span>
            )}

            {/* Add to Playlist Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                }}
                className="flex-shrink-0 p-2 text-[#666666] hover:text-white hover:bg-[#222222] rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Add to Playlist"
            >
                <Plus size={16} strokeWidth={2} />
            </button>

            <AddToPlaylistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                songId={song.id} 
            />
        </motion.div>
    );
};

export default SongCard;
