import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import type { Song } from "../../types/song.type";

interface SongListItemProps {
    song: Song;
    index?: number;
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const SongListItem = ({ song, index }: SongListItemProps) => {
    return (
        <Link 
            to={`/song/${song.id}`}
            className="group flex items-center gap-4 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors"
        >
            {index !== undefined && (
                <div className="w-6 text-center text-[#888888] text-sm font-medium group-hover:hidden">
                    {index + 1}
                </div>
            )}
            {index !== undefined && (
                <div className="w-6 text-center text-[#ededed] hidden group-hover:block">
                    <Play size={14} className="fill-current" />
                </div>
            )}

            <div className="w-10 h-10 flex-shrink-0 bg-[#282828] rounded overflow-hidden">
                <img 
                    src={song.imageUrl} 
                    alt={song.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="flex flex-col justify-center flex-grow">
                <span className="text-[#ededed] text-sm font-medium leading-tight mb-1 truncate">
                    {song.title}
                </span>
                <span className="text-[#888888] text-xs truncate">
                    {song.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
                </span>
            </div>

            <div className="text-[#888888] text-sm tabular-nums mr-2">
                {formatDuration(song.duration)}
            </div>
        </Link>
    );
};
