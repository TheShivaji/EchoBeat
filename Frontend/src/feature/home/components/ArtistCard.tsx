import { UserRound } from "lucide-react";
import type { Artist } from "../types/home.types";

interface ArtistCardProps {
    artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => (
    <div className="group flex-shrink-0 w-[140px] cursor-pointer">
        {/* Artist image */}
        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#1a1a1a] border border-[#222222] mb-3">
            {artist.imageUrl ? (
                <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <UserRound
                        size={36}
                        strokeWidth={1}
                        className="text-[#333333]"
                        aria-hidden="true"
                    />
                </div>
            )}
        </div>

        {/* Artist info */}
        <p className="text-[13.5px] font-medium text-[#d0d0d0] group-hover:text-[#ededed] transition-colors duration-150 truncate text-center leading-tight">
            {artist.name}
        </p>
        {artist.playCount !== undefined && (
            <p className="mt-0.5 text-[11.5px] font-normal text-[#555555] text-center">
                {artist.playCount.toLocaleString()} plays
            </p>
        )}
    </div>
);

export default ArtistCard;
