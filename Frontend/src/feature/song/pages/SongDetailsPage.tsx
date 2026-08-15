import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Play, Heart, Music } from "lucide-react";
import { useSong } from "../hook/useSong";
import SongDetailsSkeleton from "../components/SongDetailsSkeleton";
import SongDetailsError from "../components/SongDetailsError";

// Helper to format duration from seconds to m:ss
const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const SongDetailsPage = () => {
    // 1. Read song ID from URL parameters
    const { id } = useParams<{ id: string }>();
    
    // 2. Consume existing hook exactly as it is
    const { song, loading, error, getSongDetails } = useSong();

    // 3. Fetch song details on mount
    useEffect(() => {
        if (id) {
            getSongDetails(id);
        }
    }, [id]);

    // 4. Handle Loading and Error states using existing values
    if (loading) return <SongDetailsSkeleton />;
    if (error) return <SongDetailsError message={error} />;
    
    // 5. Handle Not Found / Empty state
    if (!song) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
                <Music className="w-12 h-12 text-[#222222] mb-4" />
                <h2 className="text-[#ededed] text-xl font-medium mb-2">Song not found</h2>
                <p className="text-[#666666] text-sm">The song you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    // Prepare presentation data
    const artistNames = song.artists && song.artists.length > 0 
        ? song.artists.map(a => a.name).join(", ") 
        : "Unknown Artist";
        
    const releaseYear = song.album?.releaseYear;

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-14">
                
                {/* ── Artwork (Left Column) ──────────────────────────────── */}
                <div className="w-full md:w-[300px] lg:w-[380px] aspect-square flex-shrink-0 bg-[#171717] rounded-lg overflow-hidden border border-[#222222] flex items-center justify-center">
                    {song.imageUrl ? (
                        <img 
                            src={song.imageUrl} 
                            alt={song.title} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Music className="w-20 h-20 text-[#222222]" />
                    )}
                </div>

                {/* ── Information & Actions (Right Column) ──────────────── */}
                <div className="flex flex-col justify-end w-full pb-2 md:pb-6">
                    
                    {/* Eyebrow */}
                    <p className="text-[11px] font-semibold text-[#666666] tracking-[0.15em] uppercase mb-3">
                        Song
                    </p>
                    
                    {/* Title */}
                    <h1 
                        className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#ededed] tracking-tight mb-4 line-clamp-2" 
                        style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                    >
                        {song.title}
                    </h1>
                    
                    {/* Artists */}
                    <h2 className="text-lg md:text-xl text-[#888888] font-medium mb-4">
                        {artistNames}
                    </h2>
                    
                    {/* Metadata Line */}
                    <div className="flex items-center flex-wrap gap-2 text-sm text-[#666666] mb-8 mt-1">
                        {song.album && (
                            <>
                                <span>{song.album.title}</span>
                                <span>•</span>
                            </>
                        )}
                        {releaseYear && (
                            <>
                                <span>{releaseYear}</span>
                                <span>•</span>
                            </>
                        )}
                        <span>{formatDuration(song.duration)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 mt-auto">
                        
                        {/* Play Button (Presentation Only) */}
                        <button 
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#f0f0f0] text-[#0c0c0c] hover:scale-105 transition-transform"
                            aria-label="Play song"
                        >
                            <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </button>
                        
                        {/* Like Button (Presentation Only, derived directly from song object) */}
                        <button 
                            className="flex items-center gap-2 text-[#888888] hover:text-[#ededed] transition-colors group"
                            aria-label={song.isLiked ? "Unlike song" : "Like song"}
                        >
                            <Heart 
                                className={`w-8 h-8 transition-colors ${song.isLiked ? "fill-[#ededed] text-[#ededed]" : "group-hover:text-[#ededed]"}`} 
                                strokeWidth={song.isLiked ? 0 : 1.5}
                            />
                            {song.likeCount > 0 && (
                                <span className={`text-sm font-medium ${song.isLiked ? "text-[#ededed]" : ""}`}>
                                    {song.likeCount}
                                </span>
                            )}
                        </button>

                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default SongDetailsPage;
