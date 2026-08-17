import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ListMusic, Globe, Lock } from "lucide-react";
import { usePlaylist } from "../hook/usePlaylist";
import { SongListItem } from "../../song/components/SongListItem";
import type { Song } from "../../song/types/song.type";

const PlaylistDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { playlist, loading, error, getPlaylistDetails } = usePlaylist();

    useEffect(() => {
        if (id) {
            getPlaylistDetails(id);
        }
    }, [id]);

    if (loading && !playlist) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#333333] border-t-[#ededed] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
                <p className="text-[#ededed] font-medium mb-2">Failed to load playlist</p>
                <p className="text-[#666666] text-sm">{error}</p>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
                <ListMusic className="w-12 h-12 text-[#222222] mb-4" />
                <h2 className="text-[#ededed] text-xl font-medium mb-2">Playlist not found</h2>
                <p className="text-[#666666] text-sm text-center max-w-sm">The playlist you're looking for doesn't exist.</p>
            </div>
        );
    }

    // Handle different song structures based on typical backend relations (e.g. many-to-many vs direct)
    const normalizedSongs: Song[] = playlist.songs 
        ? playlist.songs.map((item: any) => item.song ? item.song : item) 
        : [];

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16 pb-24">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-14 mb-16">
                
                {/* ── Artwork (Left Column) ──────────────────────────────── */}
                <div className="w-full md:w-[280px] lg:w-[320px] aspect-square flex-shrink-0 bg-[#171717] rounded-lg overflow-hidden border border-[#222222] flex items-center justify-center shadow-2xl">
                    {playlist.imageUrl ? (
                        <img 
                            src={playlist.imageUrl} 
                            alt={playlist.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ListMusic className="w-20 h-20 text-[#222222]" />
                    )}
                </div>

                {/* ── Information & Stats (Right Column) ──────────────── */}
                <div className="flex flex-col justify-end w-full pb-2 md:pb-6">
                    
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2 mb-3 text-[11px] font-semibold text-[#666666] tracking-[0.15em] uppercase">
                        {playlist.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                        <span>Playlist</span>
                    </div>
                    
                    {/* Name */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#ededed] tracking-tight mb-5 line-clamp-2"
                        style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                        {playlist.name}
                    </h1>
                    
                    {/* Description */}
                    {playlist.description ? (
                        <p className="text-sm md:text-base text-[#888888] leading-relaxed max-w-2xl mb-6">
                            {playlist.description}
                        </p>
                    ) : (
                        <p className="text-sm text-[#666666] italic mb-6">
                            No description provided.
                        </p>
                    )}
                    
                    {/* Meta data */}
                    <div className="flex items-center gap-2 text-sm text-[#888888] mt-auto">
                        <span className="font-medium text-[#ededed]">EchoBeats</span>
                        <span>•</span>
                        <span>{normalizedSongs.length} {normalizedSongs.length === 1 ? 'song' : 'songs'}</span>
                    </div>
                    
                </div>
            </div>

            {/* ── Songs ──────────────────────────────── */}
            {normalizedSongs.length > 0 ? (
                <div>
                    <div className="flex flex-col gap-1">
                        {normalizedSongs.map((song, idx) => (
                            <SongListItem key={song.id} song={song} index={idx} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-t border-[#222222]">
                    <ListMusic className="w-12 h-12 text-[#222222] mb-4" />
                    <h3 className="text-lg font-medium text-[#ededed] mb-1">It's a bit empty here...</h3>
                    <p className="text-[#888888] text-sm">Add some songs to this playlist.</p>
                </div>
            )}
        </div>
    );
};

export default PlaylistDetailsPage;
