import { ListMusic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Playlist } from "../types/playlist.types";

interface PlaylistCardProps {
    playlist: Playlist;
}

export const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
    const navigate = useNavigate();
    
    return (
        <motion.div 
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex-shrink-0 w-[120px] md:w-[140px] cursor-pointer"
        >
            <div className="relative w-full aspect-square mb-3">
                <div className="w-full h-full rounded-md overflow-hidden bg-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    {playlist.imageUrl ? (
                        <img
                            src={playlist.imageUrl}
                            alt={playlist.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#282828] text-[#888888]">
                            <ListMusic size={40} strokeWidth={1} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center text-center px-1">
                <h3 className="text-[#ededed] font-medium text-sm truncate w-full mb-1">
                    {playlist.name}
                </h3>
                <span className="text-[#888888] text-xs">
                    {playlist.isPublic ? 'Public' : 'Private'} Playlist
                </span>
            </div>
        </motion.div>
    );
};
