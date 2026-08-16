import { Play, Music } from "lucide-react";
import type { Song } from "../types/home.types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface SongCardProps {
    song: Song;
    index?: number;
    showIndex?: boolean;
}

const SongCard = ({ song, index, showIndex = false }: SongCardProps) => {
    const navigate = useNavigate();
    const primaryArtist = song.artists[0]?.name ?? "Unknown Artist";

    return (
        <motion.div 
            onClick={() => navigate(`/song/${song.id}`)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group flex items-center gap-4 px-3 py-2.5 rounded-md hover:bg-[#181818] transition-colors duration-150 cursor-pointer"
        >

            {/* Track number or artwork */}
            <div className="relative flex-shrink-0 w-10 h-10">
                {/* Artwork */}
                <div className="w-10 h-10 rounded-sm overflow-hidden bg-[#1a1a1a] border border-[#222222]">
                    {song.imageUrl ? (
                        <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Music size={14} strokeWidth={1.5} className="text-[#444444]" aria-hidden="true" />
                        </div>
                    )}
                </div>

                {/* Play overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0c]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-sm">
                    <Play size={14} strokeWidth={2} className="text-[#ededed] fill-[#ededed]" aria-hidden="true" />
                </div>
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-[#d0d0d0] group-hover:text-[#ededed] transition-colors duration-150 truncate leading-tight">
                    {song.title}
                </p>
                <p className="mt-0.5 text-[12px] font-normal text-[#666666] truncate leading-tight">
                    {primaryArtist}
                </p>
            </div>

            {/* Index or play count */}
            {showIndex && index !== undefined && (
                <span className="flex-shrink-0 text-[12px] font-normal text-[#444444] group-hover:hidden w-5 text-right">
                    {index + 1}
                </span>
            )}
            {song.playCount !== undefined && (
                <span className="flex-shrink-0 text-[12px] font-normal text-[#444444] hidden group-hover:block">
                    <Play size={12} strokeWidth={2} className="inline mr-1" />
                    {song.playCount.toLocaleString()}
                </span>
            )}
        </motion.div>
    );
};

export default SongCard;
