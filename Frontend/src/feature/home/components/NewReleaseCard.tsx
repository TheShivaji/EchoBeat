import { Play, Music } from "lucide-react";
import type { Song } from "../types/home.types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NewReleaseCardProps {
    song: Song;
}

const NewReleaseCard = ({ song }: NewReleaseCardProps) => {
    const navigate = useNavigate();
    const primaryArtist = song.artists[0]?.name ?? "Unknown Artist";
    const releaseYear = song.releasedDate
        ? new Date(song.releasedDate).getFullYear()
        : null;

    return (
        <motion.div 
            onClick={() => navigate(`/song/${song.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex-shrink-0 w-[130px] md:w-[160px] cursor-pointer"
        >
            {/* Artwork */}
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-[#1a1a1a] border border-[#222222] mb-3">
                {song.imageUrl ? (
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Music
                            size={32}
                            strokeWidth={1}
                            className="text-[#333333]"
                            aria-hidden="true"
                        />
                    </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0c]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center shadow-lg">
                        <Play
                            size={16}
                            strokeWidth={2}
                            className="text-[#0c0c0c] fill-[#0c0c0c] ml-0.5"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <p className="text-[13px] font-medium text-[#d0d0d0] group-hover:text-[#ededed] transition-colors duration-150 truncate leading-tight">
                {song.title}
            </p>
            <p className="mt-1 text-[11.5px] font-normal text-[#666666] truncate leading-tight">
                {primaryArtist}
                {releaseYear && (
                    <span className="text-[#444444]"> · {releaseYear}</span>
                )}
            </p>
        </motion.div>
    );
};

export default NewReleaseCard;
