import { usePlayer } from "../hook/usePlayer"
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume1, Volume2, Music } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const MiniPlayer = () => {
    const navigate = useNavigate();
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        progressBarRef,
        togglePlay,
        handleSeek,
        handleVolumeChange,
        toggleMute,
    } = usePlayer();

    if (!currentSong) {
        return null;
    }

    const primaryArtist = currentSong.artists && currentSong.artists.length > 0 
        ? currentSong.artists[0].name 
        : "Unknown Artist";

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    const handlePlayerClick = (e: React.MouseEvent) => {
        // Prevent navigating if clicking on controls
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('.group')) {
            return;
        }
        navigate('/player');
    };

    return (
        <div 
            onClick={handlePlayerClick}
            className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] z-50 flex flex-row items-center justify-between px-3 md:px-4 py-2 md:py-3 h-[60px] md:h-[90px] cursor-pointer hover:bg-[#202020] transition-colors"
        >
            
            {/* LEFT: Artwork & Info */}
            <div className="flex items-center gap-3 w-full md:w-[30%] min-w-0 md:min-w-[180px]">
                <div className="relative w-10 h-10 md:w-14 md:h-14 bg-[#282828] rounded flex-shrink-0 overflow-hidden shadow">
                    {currentSong.imageUrl ? (
                        <img 
                            src={currentSong.imageUrl} 
                            alt={currentSong.title} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Music size={20} className="text-[#888888]" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-w-0 mr-auto md:mr-0 justify-center">
                    <p className="text-[13px] md:text-sm text-white font-medium truncate">
                        {currentSong.title}
                    </p>
                    <p className="text-[11px] md:text-xs text-[#b3b3b3] truncate hover:underline cursor-pointer mt-0.5">
                        {primaryArtist}
                    </p>
                </div>
                
                {/* Mobile Play Button (Right aligned) */}
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay} 
                    className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white text-black ml-2 flex-shrink-0"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause size={16} fill="black" />
                    ) : (
                        <Play size={16} fill="black" className="ml-0.5" />
                    )}
                </motion.button>
            </div>

            {/* CENTER: Controls & Shared Progress */}
            <div className="absolute top-0 left-0 right-0 md:static md:flex flex-col items-center justify-center md:w-[40%] md:max-w-[722px]">
                
                {/* Desktop Controls */}
                <div className="hidden md:flex items-center gap-6 mb-2">
                    <button className="text-[#b3b3b3] hover:text-white transition-colors" aria-label="Previous song">
                        <SkipBack size={20} fill="currentColor" />
                    </button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePlay} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause size={16} fill="black" />
                        ) : (
                            <Play size={16} fill="black" className="ml-0.5" />
                        )}
                    </motion.button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors" aria-label="Next song">
                        <SkipForward size={20} fill="currentColor" />
                    </button>
                </div>
                
                {/* Shared Progress Bar (Absolute top on Mobile, Flex on Desktop) */}
                <div className="w-full flex items-center gap-2">
                    <span className="hidden md:block text-xs text-[#b3b3b3] min-w-[40px] text-right">
                        {formatTime(currentTime)}
                    </span>
                    
                    <div 
                        className="group flex-1 h-1 md:h-1 bg-[#4d4d4d] md:rounded-full cursor-pointer relative"
                        ref={progressBarRef}
                        onClick={handleSeek}
                    >
                        {/* Hover Hitbox for easier clicking on desktop */}
                        <div className="hidden md:block absolute -top-2 -bottom-2 left-0 right-0" />
                        
                        <div 
                            className="h-full bg-white md:group-hover:bg-[#1db954] md:rounded-full relative" 
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-[-4px] md:right-[-6px] top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow" />
                        </div>
                    </div>
                    
                    <span className="hidden md:block text-xs text-[#b3b3b3] min-w-[40px] text-left">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* RIGHT: Volume Controls (Desktop Only) */}
            <div className="hidden md:flex items-center justify-end gap-2 w-[30%] min-w-[180px]">
                <button 
                    onClick={toggleMute} 
                    className="text-[#b3b3b3] hover:text-white transition-colors" 
                    aria-label={volume === 0 ? "Unmute" : "Mute"}
                >
                    <VolumeIcon size={20} />
                </button>
                <div className="w-24 group flex items-center">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer accent-white hover:accent-[#1db954] transition-colors"
                        aria-label="Volume"
                        style={{
                            background: `linear-gradient(to right, white ${volume * 100}%, #4d4d4d ${volume * 100}%)`
                        }}
                    />
                </div>
            </div>
            
        </div>
    );
};