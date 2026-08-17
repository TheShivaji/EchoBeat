import { useEffect } from "react";
import { useSong } from "../hook/useSong";
import { SongListItem } from "../components/SongListItem";
import { Heart, Loader2 } from "lucide-react";

const LikedSongsPage = () => {
    const { likedSongs, loading, error, getLikedSongs } = useSong();

    useEffect(() => {
        getLikedSongs();
    }, []);

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16 pb-24">
            <header className="mb-10 flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#4c1d95] to-[#7c3aed] flex items-center justify-center rounded-xl shadow-lg flex-shrink-0">
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
                </div>
                <div>
                    <p className="text-[11px] font-semibold text-[#888888] tracking-[0.15em] uppercase mb-1">
                        Playlist
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#ededed] tracking-tight">
                        Liked Songs
                    </h1>
                    <p className="text-[#888888] text-sm mt-2">
                        {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#666666] animate-spin" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-[#ededed] font-medium mb-2">Failed to load liked songs</p>
                    <p className="text-[#666666] text-sm">{error}</p>
                </div>
            ) : likedSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-t border-[#222222]">
                    <Heart className="w-12 h-12 text-[#222222] mb-4" />
                    <p className="text-lg font-medium text-[#ededed] mb-1">Songs you like will appear here</p>
                    <p className="text-[#888888] text-sm">Save songs by tapping the heart icon.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {likedSongs.map((song, idx) => (
                        <SongListItem key={song.id} song={song} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikedSongsPage;
