import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { User, Music, Disc } from "lucide-react";
import { useArtists } from "../hook/useArtists";
import ArtistDetailsSkeleton from "../components/ArtistDetailsSkeleton";
import ArtistDetailsError from "../components/ArtistDetailsError";
import { SongListItem } from "../../song/components/SongListItem";
import { AlbumCard } from "../../home/components/AlbumCard";

const ArtistDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { 
        artist, 
        loading, 
        error, 
        getArtistDeatils,
        artistSongs,
        artistAlbums,
        getArtistSongs,
        getArtistAlbums
    } = useArtists();

    useEffect(() => {
        if (id) {
            getArtistDeatils(id);
            getArtistSongs(id, 1, 5); // Fetch top 5 songs
            getArtistAlbums(id, 1, 5); // Fetch top 5 albums
        }
    }, [id]);

    if (loading && !artist) return <ArtistDetailsSkeleton />;
    if (error) return <ArtistDetailsError message={error} />;
    
    if (!artist) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
                <User className="w-12 h-12 text-[#222222] mb-4" />
                <h2 className="text-[#ededed] text-xl font-medium mb-2">Artist not found</h2>
                <p className="text-[#666666] text-sm text-center max-w-sm">The artist you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    const songCount = artist._count?.songs || 0;
    const albumCount = artist._count?.albums || 0;

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16 pb-24">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-14 mb-16">
                
                {/* ── Artwork (Left Column) ──────────────────────────────── */}
                <div className="w-full md:w-[300px] lg:w-[380px] aspect-square flex-shrink-0 bg-[#171717] rounded-lg overflow-hidden border border-[#222222] flex items-center justify-center">
                    {artist.imageUrl ? (
                        <img 
                            src={artist.imageUrl} 
                            alt={artist.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-20 h-20 text-[#222222]" />
                    )}
                </div>

                {/* ── Information & Stats (Right Column) ──────────────── */}
                <div className="flex flex-col justify-end w-full pb-2 md:pb-6">
                    
                    {/* Eyebrow */}
                    <p className="text-[11px] font-semibold text-[#666666] tracking-[0.15em] uppercase mb-3">
                        Artist
                    </p>
                    
                    {/* Name - Using sans-serif as requested */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#ededed] tracking-tight mb-5 line-clamp-2">
                        {artist.name}
                    </h1>
                    
                    {/* Bio */}
                    {artist.bio ? (
                        <p className="text-sm md:text-base text-[#888888] leading-relaxed max-w-2xl mb-8">
                            {artist.bio}
                        </p>
                    ) : (
                        <p className="text-sm text-[#666666] italic mb-8">
                            No biography available.
                        </p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center gap-8 mt-auto">
                        <div className="flex items-center gap-2.5">
                            <Music className="w-5 h-5 text-[#666666]" />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#666666] leading-none mb-1">Songs</span>
                                <span className="text-lg font-medium text-[#ededed] leading-none">{songCount}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                            <Disc className="w-5 h-5 text-[#666666]" />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#666666] leading-none mb-1">Albums</span>
                                <span className="text-lg font-medium text-[#ededed] leading-none">{albumCount}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* ── Top Songs ──────────────────────────────── */}
            {artistSongs.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#ededed]">Popular Songs</h2>
                        {songCount > 5 && (
                            <Link 
                                to={`/artist/${artist.id}/songs`}
                                className="text-sm font-medium text-[#888888] hover:text-[#ededed] transition-colors"
                            >
                                See all
                            </Link>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        {artistSongs.map((song, idx) => (
                            <SongListItem key={song.id} song={song} index={idx} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Albums ──────────────────────────────── */}
            {artistAlbums.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#ededed]">Albums</h2>
                        {albumCount > 5 && (
                            <Link 
                                to={`/artist/${artist.id}/albums`}
                                className="text-sm font-medium text-[#888888] hover:text-[#ededed] transition-colors"
                            >
                                See all
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {artistAlbums.map((album) => (
                            <AlbumCard key={album.id} album={album} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistDetailsPage;
