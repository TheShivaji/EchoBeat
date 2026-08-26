import { Disc3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Album } from "../../song/types/song.type";

interface AlbumCardProps {
    album: Album;
}

export const AlbumCard = ({ album }: AlbumCardProps) => {
    const navigate = useNavigate();
    
    return (
        <motion.div 
            onClick={() => navigate(`/album/${album.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex-shrink-0 w-[140px] md:w-[170px] cursor-pointer"
        >
            <div className="relative w-full aspect-square mb-3">
                <div className="w-full h-full rounded-lg overflow-hidden bg-[#121212] border border-[#222] shadow-sm group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300">
                    {album.imageUrl ? (
                        <img
                            src={album.imageUrl}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#121212] text-[#444]">
                            <Disc3 size={48} strokeWidth={1} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center text-center px-1">
                <h3 className="text-[#ededed] group-hover:text-white transition-colors duration-300 font-semibold text-[14px] truncate w-full mb-1 leading-tight">
                    {album.title}
                </h3>
                <span className="text-[#888] font-medium text-[12px] uppercase tracking-wide">
                    Album {album.releaseYear ? `• ${album.releaseYear}` : ''}
                </span>
            </div>
        </motion.div>
    );
};
