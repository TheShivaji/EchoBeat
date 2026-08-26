import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Artist } from "../types/home.types";

interface ArtistCardProps {
    artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
    const navigate = useNavigate();
    
    return (
        <motion.div 
            onClick={() => navigate(`/artist/${artist.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex-shrink-0 w-[110px] md:w-[140px] cursor-pointer"
        >
        {/* Artist image */}
        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#121212] border border-[#222] shadow-sm group-hover:shadow-[0_4px_24px_rgba(255,255,255,0.03)] group-hover:border-[#333] transition-all duration-300 ease-out mb-4">
            {artist.imageUrl ? (
                <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <UserRound
                        size={40}
                        strokeWidth={1}
                        className="text-[#444]"
                        aria-hidden="true"
                    />
                </div>
            )}
        </div>

        {/* Artist info */}
        <p className="text-[14px] font-semibold text-[#ededed] group-hover:text-white transition-colors duration-300 truncate text-center leading-tight">
            {artist.name}
        </p>
        {artist.playCount !== undefined && (
            <p className="mt-1 text-[12px] font-medium text-[#777] text-center tracking-wide uppercase">
                {artist.playCount.toLocaleString()} plays
            </p>
        )}
    </motion.div>
    );
};

export default ArtistCard;
