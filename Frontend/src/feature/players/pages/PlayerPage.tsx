import { useNavigate } from "react-router-dom";
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Volume1, Heart, Music } from "lucide-react";
import { usePlayer } from "../hook/usePlayer";
import { motion } from "framer-motion";

const PlayerPage = () => {
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
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#121212] flex items-center justify-center shadow-2xl">
                    <Music size={40} className="text-[#a7a7a7]" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">No song is playing</h1>
                <p className="text-[#a7a7a7] mb-8 max-w-sm">Select a track, album, or playlist to start your listening experience.</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const primaryArtist = currentSong.artists && currentSong.artists.length > 0 
        ? currentSong.artists.map(a => a.name).join(", ") 
        : "Unknown Artist";

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    return (
        <div className="min-h-screen h-[100dvh] bg-[#0c0c0c] text-white flex flex-col relative overflow-hidden">
            
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Deep radial base */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1f1f1f] via-[#0c0c0c] to-[#0c0c0c] opacity-80" />
                
                {/* Artwork Ambient Glow */}
                {currentSong.imageUrl && (
                    <div className="absolute inset-0 opacity-[0.15]">
                        <img 
                            src={currentSong.imageUrl} 
                            alt="" 
                            className="w-full h-full object-cover blur-[80px] scale-150 saturate-150"
                        />
                    </div>
                )}

                {/* Vignette for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 w-full px-6 py-6 flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronDown size={28} className="text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#b3b3b3]">Now Playing</span>
                    <span className="text-sm font-medium">{currentSong.album?.title || "Single"}</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Main Player Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-8 md:pb-12 w-full max-w-lg mx-auto">
                
                {/* Artwork Area */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[360px] md:max-w-[420px] aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-2xl mb-8 md:mb-12 flex items-center justify-center relative"
                >
                    {currentSong.imageUrl ? (
                        <img 
                            src={currentSong.imageUrl} 
                            alt={currentSong.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // Premium Fallback
                        <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#121212] flex items-center justify-center relative">
                            {/* Inner subtle glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
                            <Music size={80} className="text-[#888888] drop-shadow-lg" strokeWidth={1} />
                        </div>
                    )}
                </motion.div>

                {/* Metadata & Like */}
                <div className="w-full flex items-center justify-between mb-6 md:mb-8">
                    <div className="flex flex-col min-w-0 pr-4">
                        <h2 className="text-2xl md:text-3xl font-bold truncate text-white mb-0.5">
                            {currentSong.title}
                        </h2>
                        <p className="text-lg text-[#b3b3b3] truncate font-medium">
                            {primaryArtist}
                        </p>
                    </div>
                    <button className="flex-shrink-0 text-[#b3b3b3] hover:text-white transition-colors">
                        <Heart size={26} className={currentSong.isLiked ? "fill-[#1db954] text-[#1db954]" : ""} strokeWidth={currentSong.isLiked ? 0 : 2} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-6 md:mb-8">
                    <div 
                        className="group w-full h-[4px] bg-[#4d4d4d] rounded-full cursor-pointer relative mb-2"
                        ref={progressBarRef}
                        onClick={handleSeek}
                    >
                        {/* Invisible larger hit area for touch */}
                        <div className="absolute -top-4 -bottom-4 left-0 right-0" />
                        
                        {/* Fill */}
                        <div 
                            className="h-full bg-white rounded-full relative group-hover:bg-[#1db954] transition-colors" 
                            style={{ width: `${progress}%` }}
                        >
                            {/* Thumb (Appears on hover) */}
                            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition-opacity" />
                        </div>
                    </div>
                    
                    {/* Time Indicators */}
                    <div className="flex items-center justify-between text-xs text-[#b3b3b3] font-medium font-mono tabular-nums">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="w-full flex items-center justify-between max-w-[320px] md:max-w-[400px] mb-8 md:mb-10">
                    <button className="text-[#b3b3b3] hover:text-white transition-colors p-2" aria-label="Shuffle">
                        <Shuffle size={20} strokeWidth={2} />
                    </button>
                    
                    <div className="flex items-center gap-5 md:gap-8">
                        <button className="text-[#b3b3b3] hover:text-white transition-colors p-2" aria-label="Previous">
                            <SkipBack size={28} className="fill-current" strokeWidth={1} />
                        </button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="w-16 h-16 md:w-18 md:h-18 flex items-center justify-center rounded-full bg-white text-black shadow-lg"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <Pause size={28} className="fill-current" strokeWidth={1} />
                            ) : (
                                <Play size={28} className="fill-current translate-x-[2px]" strokeWidth={1} />
                            )}
                        </motion.button>
                        
                        <button className="text-[#b3b3b3] hover:text-white transition-colors p-2" aria-label="Next">
                            <SkipForward size={28} className="fill-current" strokeWidth={1} />
                        </button>
                    </div>

                    <button className="text-[#b3b3b3] hover:text-white transition-colors p-2" aria-label="Repeat">
                        <Repeat size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* Volume Control */}
                <div className="w-full max-w-[300px] flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                    <button onClick={toggleMute} className="text-[#b3b3b3] hover:text-white transition-colors" aria-label="Mute">
                        <VolumeIcon size={18} strokeWidth={2} />
                    </button>
                    <div className="flex-1 group h-[4px] bg-[#4d4d4d] rounded-full relative flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume * 100}
                            onChange={handleVolumeChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            aria-label="Volume"
                        />
                        <div 
                            className="h-full bg-white rounded-full pointer-events-none group-hover:bg-[#1db954] transition-colors"
                            style={{ width: `${volume * 100}%` }}
                        />
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default PlayerPage;
