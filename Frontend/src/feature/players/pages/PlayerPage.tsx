import { useNavigate } from "react-router-dom";
import {
    ChevronDown,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Volume2,
    VolumeX,
    Volume1,
    Heart,
    Music,
    Plus,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { usePlayer } from "../hook/usePlayer";
import AddToPlaylistModal from "../../playlist/components/AddToPlaylistModal";
import { AILyricsModal } from "../../ai/components/AILyricsModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/app.store";
import type { Song } from "../../song/types/song.type";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────────────── Tiny Equalizer Bars ───────────────────────── */

const EqualizerBars = () => (
    <div className="flex items-end gap-[3px] h-4">
        {[0, 1, 2, 3].map((i) => (
            <motion.div
                key={i}
                className="w-[3px] rounded-full bg-[#1db954]"
                animate={{
                    height: ["40%", "100%", "60%", "90%", "40%"],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.15,
                }}
            />
        ))}
    </div>
);

/* ──────────────────── Artwork with premium fallback ──────────────────── */

const SongArtwork = ({
    song,
    size = "lg",
}: {
    song: Song;
    size?: "sm" | "lg";
}) => {
    const iconSize = size === "lg" ? 64 : 36;

    if (song.imageUrl) {
        return (
            <img
                src={song.imageUrl}
                alt={song.title}
                className="w-full h-full object-cover"
                draggable={false}
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop";
                }}
            />
        );
    }

    return (
        <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#121212] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)]" />
            <Music
                size={iconSize}
                className="text-[#555] drop-shadow-lg"
                strokeWidth={1}
            />
        </div>
    );
};

/* ──────────────────── Artist name helper ──────────────────── */

const getArtistName = (song: Song): string =>
    song.artists && song.artists.length > 0
        ? song.artists.map((a) => a.name).join(", ")
        : "Unknown Artist";

/* ─────────────────── Queue Card (Previous / Next) ─────────────────── */

const QueueCard = ({
    song,
    label,
    onClick,
}: {
    song: Song;
    label: string;
    onClick: () => void;
}) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="group flex-shrink-0 w-[200px] md:w-[220px] lg:w-[240px] cursor-pointer text-left focus:outline-none"
        aria-label={`${label}: ${song.title}`}
    >
        {/* Card container */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover:bg-white/[0.07] group-hover:border-white/[0.1] group-hover:shadow-lg group-hover:shadow-black/30">
            {/* Artwork */}
            <div className="aspect-square overflow-hidden">
                <SongArtwork song={song} size="sm" />
            </div>

            {/* Info */}
            <div className="px-3.5 py-3">
                <p className="text-[13px] font-semibold text-[#d1d1d1] truncate group-hover:text-white transition-colors">
                    {song.title}
                </p>
                <p className="text-[11px] text-[#777] truncate mt-0.5 group-hover:text-[#999] transition-colors">
                    {getArtistName(song)}
                </p>
            </div>
        </div>

        {/* Label */}
        <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#555] text-center mt-2.5">
            {label}
        </p>
    </motion.button>
);

/* ───────────────────── Current Song Hero Card ───────────────────── */

const CurrentCard = ({
    song,
    isPlaying,
}: {
    song: Song;
    isPlaying: boolean;
}) => (
    <motion.div
        layout
        key={song.id}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px]"
    >
        {/* Outer glow ring */}
        <div
            className={`
                rounded-[20px] p-[1px] transition-all duration-700
                ${isPlaying
                    ? "bg-gradient-to-br from-[#1db954]/30 via-white/10 to-[#1db954]/20 shadow-[0_0_60px_-10px_rgba(29,185,84,0.2)]"
                    : "bg-gradient-to-br from-white/10 via-white/5 to-white/10 shadow-2xl"
                }
            `}
        >
            <div className="rounded-[19px] bg-[#161616]/90 backdrop-blur-xl overflow-hidden">
                {/* Artwork */}
                <div className="aspect-square overflow-hidden relative">
                    <SongArtwork song={song} size="lg" />

                    {/* Playing overlay indicator */}
                    {isPlaying && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2">
                            <EqualizerBars />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1db954]">
                                Playing
                            </span>
                        </div>
                    )}
                </div>

                {/* Song Info */}
                <div className="px-5 py-4">
                    <h2 className="text-lg md:text-xl font-bold text-white truncate">
                        {song.title}
                    </h2>
                    <p className="text-sm text-[#999] truncate mt-0.5 font-medium">
                        {getArtistName(song)}
                    </p>
                    {song.album && (
                        <p className="text-[11px] text-[#555] truncate mt-1.5 font-medium">
                            {song.album.title}
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Label */}
        <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#1db954] text-center mt-3">
            Now Playing
        </p>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════ */
/*                           PLAYER PAGE                                 */
/* ═══════════════════════════════════════════════════════════════════════ */

const PlayerPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false);

    /* ── Existing hook data (NO new state) ── */
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
        nextSong,
        previousSong,
    } = usePlayer();

    /* ── Queue data from Redux (single source of truth) ── */
    const queue = useSelector((state: RootState) => state.player.queue);
    const currentIndex = useSelector(
        (state: RootState) => state.player.currentIndex
    );

    /* ── Derived prev / next songs ── */
    const hasSongs = queue.length > 0;
    const prevSong: Song | null =
        hasSongs
            ? queue[currentIndex === 0 ? queue.length - 1 : currentIndex - 1]
            : null;
    const nextSongItem: Song | null =
        hasSongs
            ? queue[currentIndex === queue.length - 1 ? 0 : currentIndex + 1]
            : null;

    /* ── Helpers ── */
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const VolumeIcon =
        volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    /* ═══════════════════ EMPTY STATE ═══════════════════ */

    if (!currentSong) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-[#121212] flex items-center justify-center shadow-2xl">
                    <Music size={40} className="text-[#a7a7a7]" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    No song is playing
                </h1>
                <p className="text-[#a7a7a7] mb-8 max-w-sm">
                    Select a track, album, or playlist to start your listening
                    experience.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const primaryArtist = getArtistName(currentSong);

    /* ═══════════════════ MAIN RENDER ═══════════════════ */

    return (
        <div className="min-h-screen h-[100dvh] bg-[#0c0c0c] text-white flex flex-col relative overflow-hidden">
            {/* ── Background Atmosphere ── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1f1f1f] via-[#0c0c0c] to-[#0c0c0c] opacity-80" />
                {currentSong.imageUrl && (
                    <div className="absolute inset-0 opacity-[0.12]">
                        <img
                            src={currentSong.imageUrl}
                            alt=""
                            className="w-full h-full object-cover blur-[100px] scale-150 saturate-150"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
            </div>

            {/* ── Top Bar ── */}
            <div className="relative z-10 w-full px-6 py-5 flex items-center justify-between flex-shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronDown size={28} className="text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#b3b3b3]">
                        Now Playing
                    </span>
                    <span className="text-sm font-medium">
                        {currentSong.album?.title || "Single"}
                    </span>
                </div>
                <div className="w-10" />
            </div>

            {/* ── Scrollable Content ── */}
            <div className="relative z-10 flex-1 flex flex-col items-center overflow-y-auto overflow-x-hidden px-4 md:px-6">
                {/* ─────────── 3-CARD QUEUE SECTION ─────────── */}
                <div className="w-full flex items-center justify-center py-4 md:py-8">
                    <div className="flex items-end justify-center gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hidden px-6 snap-x snap-mandatory md:snap-none md:overflow-visible w-full max-w-[920px]">
                        {/* Previous Card */}
                        {prevSong && queue.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 0.7, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="hidden md:block snap-center"
                            >
                                <QueueCard
                                    song={prevSong}
                                    label="Previous"
                                    onClick={previousSong}
                                />
                            </motion.div>
                        )}

                        {/* Current Hero Card */}
                        <div className="snap-center flex-shrink-0">
                            <AnimatePresence mode="wait">
                                <CurrentCard
                                    key={currentSong.id}
                                    song={currentSong}
                                    isPlaying={isPlaying}
                                />
                            </AnimatePresence>
                        </div>

                        {/* Next Card */}
                        {nextSongItem && queue.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 0.7, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="hidden md:block snap-center"
                            >
                                <QueueCard
                                    song={nextSongItem}
                                    label="Next"
                                    onClick={nextSong}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ── Mobile Queue Preview (mini prev/next) ── */}
                {queue.length > 1 && (
                    <div className="flex md:hidden items-center justify-center gap-3 mb-4 w-full max-w-[340px]">
                        {prevSong && (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={previousSong}
                                className="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                    <SongArtwork song={prevSong} size="sm" />
                                </div>
                                <div className="min-w-0 text-left">
                                    <p className="text-[11px] text-[#666] font-semibold uppercase tracking-wider">
                                        Prev
                                    </p>
                                    <p className="text-[12px] text-[#bbb] truncate font-medium">
                                        {prevSong.title}
                                    </p>
                                </div>
                            </motion.button>
                        )}
                        {nextSongItem && (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={nextSong}
                                className="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                    <SongArtwork
                                        song={nextSongItem}
                                        size="sm"
                                    />
                                </div>
                                <div className="min-w-0 text-left">
                                    <p className="text-[11px] text-[#666] font-semibold uppercase tracking-wider">
                                        Next
                                    </p>
                                    <p className="text-[12px] text-[#bbb] truncate font-medium">
                                        {nextSongItem.title}
                                    </p>
                                </div>
                            </motion.button>
                        )}
                    </div>
                )}

                {/* ─────────── METADATA & LIKE ─────────── */}
                <div className="w-full max-w-[420px] flex items-center justify-between mb-5 md:mb-6 px-1">
                    <div className="flex flex-col min-w-0 pr-4">
                        <h2 className="text-xl md:text-2xl font-bold truncate text-white mb-0.5">
                            {currentSong.title}
                        </h2>
                        <p className="text-base text-[#b3b3b3] truncate font-medium">
                            {primaryArtist}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsLyricsModalOpen(true)}
                            className="flex-shrink-0 text-[#b3b3b3] hover:text-[#1db954] transition-colors p-1"
                            aria-label="AI Lyrics & Meaning"
                            title="AI Lyrics & Meaning"
                        >
                            <Sparkles size={22} strokeWidth={2} />
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex-shrink-0 text-[#b3b3b3] hover:text-white transition-colors"
                            aria-label="Add to Playlist"
                        >
                            <Plus size={24} strokeWidth={2} />
                        </button>
                        <button className="flex-shrink-0 text-[#b3b3b3] hover:text-white transition-colors">
                            <Heart
                                size={24}
                                className={
                                    currentSong.isLiked
                                        ? "fill-[#1db954] text-[#1db954]"
                                        : ""
                                }
                                strokeWidth={currentSong.isLiked ? 0 : 2}
                            />
                        </button>
                    </div>
                </div>

                {/* ─────────── PROGRESS BAR ─────────── */}
                <div className="w-full max-w-[420px] mb-5 md:mb-6 px-1">
                    <div
                        className="group w-full h-[4px] bg-[#4d4d4d] rounded-full cursor-pointer relative mb-2"
                        ref={progressBarRef}
                        onClick={handleSeek}
                    >
                        <div className="absolute -top-4 -bottom-4 left-0 right-0" />
                        <div
                            className="h-full bg-white rounded-full relative group-hover:bg-[#1db954] transition-colors"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition-opacity" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#b3b3b3] font-medium font-mono tabular-nums">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* ─────────── PLAYBACK CONTROLS ─────────── */}
                <div className="w-full max-w-[340px] md:max-w-[400px] flex items-center justify-between mb-6 md:mb-8">
                    <button
                        className="text-[#b3b3b3] hover:text-white transition-colors p-2"
                        aria-label="Shuffle"
                    >
                        <Shuffle size={20} strokeWidth={2} />
                    </button>

                    <div className="flex items-center gap-5 md:gap-8">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={previousSong}
                            className="text-[#b3b3b3] hover:text-white transition-colors p-2"
                            aria-label="Previous"
                        >
                            <SkipBack
                                size={28}
                                className="fill-current"
                                strokeWidth={1}
                            />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="w-16 h-16 md:w-[68px] md:h-[68px] flex items-center justify-center rounded-full bg-white text-black shadow-lg"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <Pause
                                    size={28}
                                    className="fill-current"
                                    strokeWidth={1}
                                />
                            ) : (
                                <Play
                                    size={28}
                                    className="fill-current translate-x-[2px]"
                                    strokeWidth={1}
                                />
                            )}
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={nextSong}
                            className="text-[#b3b3b3] hover:text-white transition-colors p-2"
                            aria-label="Next"
                        >
                            <SkipForward
                                size={28}
                                className="fill-current"
                                strokeWidth={1}
                            />
                        </motion.button>
                    </div>

                    <button
                        className="text-[#b3b3b3] hover:text-white transition-colors p-2"
                        aria-label="Repeat"
                    >
                        <Repeat size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* ─────────── VOLUME CONTROL ─────────── */}
                <div className="w-full max-w-[300px] flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity mb-8">
                    <button
                        onClick={toggleMute}
                        className="text-[#b3b3b3] hover:text-white transition-colors"
                        aria-label="Mute"
                    >
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
            <AddToPlaylistModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                songId={currentSong.id} 
            />
            <AILyricsModal
                isOpen={isLyricsModalOpen}
                onClose={() => setIsLyricsModalOpen(false)}
                song={currentSong}
            />
        </div>
    );
};

export default PlayerPage;
