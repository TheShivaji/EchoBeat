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
            className="group flex-shrink-0 w-[140px] md:w-[170px] cursor-pointer"
        >
            {/* Artwork */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#121212] border border-[#222] shadow-sm mb-3">
                {song.imageUrl ? (
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Music
                            size={36}
                            strokeWidth={1}
                            className="text-[#444]"
                            aria-hidden="true"
                        />
                    </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-end justify-end p-2 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-11 h-11 rounded-full bg-[#8c52ff] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[#9d6aff]">
                        <Play
                            size={18}
                            strokeWidth={2}
                            className="text-white fill-white ml-1"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <p className="text-[14px] font-semibold text-[#ededed] group-hover:text-white transition-colors duration-300 truncate leading-tight">
                {song.title}
            </p>
            <p className="mt-1 text-[12px] font-medium text-[#888] truncate leading-tight">
                {primaryArtist}
                {releaseYear && (
                    <span className="text-[#555]"> · {releaseYear}</span>
                )}
            </p>
        </motion.div>
    );
};

export default NewReleaseCard;
