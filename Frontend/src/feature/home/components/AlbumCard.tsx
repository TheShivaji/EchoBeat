import { Disc3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Album } from "../../song/types/song.type";

interface AlbumCardProps {
    album: Album;
}

export const AlbumCard = ({ album }: AlbumCardProps) => {
    const navigate = useNavigate();
    
    return (
        <div 
            onClick={() => navigate(`/album/${album.id}`)}
            className="group flex-shrink-0 w-[140px] cursor-pointer"
        >
            <div className="relative w-full aspect-square mb-3">
                <div className="w-full h-full rounded-md overflow-hidden bg-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    {album.imageUrl ? (
                        <img
                            src={album.imageUrl}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#282828] text-[#888888]">
                            <Disc3 size={40} strokeWidth={1} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center text-center px-1">
                <h3 className="text-[#ededed] font-medium text-sm truncate w-full mb-1">
                    {album.title}
                </h3>
                <span className="text-[#888888] text-xs">
                    Album {album.releaseYear ? `• ${album.releaseYear}` : ''}
                </span>
            </div>
        </div>
    );
};
