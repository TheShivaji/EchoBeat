import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Disc, Disc3, Loader2 } from "lucide-react";
import { useAlbum } from "../hook/useAlbum";
import { SongListItem } from "../../song/components/SongListItem";

const AlbumDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { album, loading, error, getAlbumDetails } = useAlbum();

    useEffect(() => {
        if (id) {
            getAlbumDetails(id);
        }
    }, [id]);

    if (loading && !album) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#333333] border-t-[#ededed] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
                <p className="text-[#ededed] font-medium mb-2">Failed to load album</p>
                <p className="text-[#666666] text-sm">{error}</p>
            </div>
        );
    }

    if (!album) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
                <Disc3 className="w-12 h-12 text-[#222222] mb-4" />
                <h2 className="text-[#ededed] text-xl font-medium mb-2">Album not found</h2>
                <p className="text-[#666666] text-sm text-center max-w-sm">The album you're looking for doesn't exist.</p>
            </div>
        );
    }

    const songs = album.songs || [];

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16 pb-24">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-14 mb-16">
                
                {/* ── Artwork (Left Column) ──────────────────────────────── */}
                <div className="w-full md:w-[280px] lg:w-[320px] aspect-square flex-shrink-0 bg-[#171717] rounded-lg overflow-hidden border border-[#222222] flex items-center justify-center shadow-2xl">
                    {album.imageUrl ? (
                        <img 
                            src={album.imageUrl} 
                            alt={album.title} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Disc3 className="w-20 h-20 text-[#222222]" />
                    )}
                </div>

                {/* ── Information & Stats (Right Column) ──────────────── */}
                <div className="flex flex-col justify-end w-full pb-2 md:pb-6">
                    
                    {/* Eyebrow */}
                    <p className="text-[11px] font-semibold text-[#666666] tracking-[0.15em] uppercase mb-3">
                        Album
                    </p>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#ededed] tracking-tight mb-5 line-clamp-2"
                        style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                        {album.title}
                    </h1>
                    
                    {/* Meta data */}
                    <div className="flex items-center gap-2 text-sm mt-auto">
                        {/* Assuming there might be an artist relation populated, otherwise just EchoBeats */}
                        <span className="font-medium text-[#ededed]">EchoBeats</span>
                        <span className="text-[#888888]">•</span>
                        <span className="text-[#888888]">{album.releaseYear || "Unknown Year"}</span>
                        <span className="text-[#888888]">•</span>
                        <span className="text-[#888888]">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
                    </div>
                    
                </div>
            </div>

            {/* ── Songs ──────────────────────────────── */}
            {songs.length > 0 ? (
                <div>
                    <div className="flex flex-col gap-1">
                        {songs.map((song, idx) => (
                            <SongListItem key={song.id} song={song} index={idx} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-t border-[#222222]">
                    <Disc className="w-12 h-12 text-[#222222] mb-4" />
                    <h3 className="text-lg font-medium text-[#ededed] mb-1">No songs yet</h3>
                    <p className="text-[#888888] text-sm">This album currently has no songs.</p>
                </div>
            )}
        </div>
    );
};

export default AlbumDetailsPage;
