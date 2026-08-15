import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useArtists } from "../hook/useArtists";
import { SongListItem } from "../../song/components/SongListItem";

const ArtistSongsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [page, setPage] = useState(1);
    const limit = 20;

    const { 
        artist, 
        artistSongs, 
        songsPagination, 
        loading, 
        error, 
        getArtistDeatils, 
        getArtistSongs 
    } = useArtists();

    useEffect(() => {
        if (id) {
            getArtistDeatils(id);
            getArtistSongs(id, page, limit);
        }
    }, [id, page]);

    const handleNextPage = () => {
        if (songsPagination && page < songsPagination.totalPages) {
            setPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Link to={`/artist/${id}`} className="text-[#ededed] hover:underline">Go back</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 pb-24">
            <div className="flex items-center gap-4 mb-10">
                <Link 
                    to={`/artist/${id}`}
                    className="w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center hover:bg-[#222] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#ededed]" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[#ededed] tracking-tight">All Songs</h1>
                    {artist && (
                        <p className="text-[#888888] text-sm mt-1">{artist.name}</p>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#666666] animate-spin" />
                </div>
            ) : artistSongs.length === 0 ? (
                <div className="flex justify-center py-20">
                    <p className="text-[#888888]">No songs found.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {artistSongs.map((song, idx) => (
                        <SongListItem key={song.id} song={song} index={((page - 1) * limit) + idx} />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && songsPagination && songsPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#171717] text-[#ededed] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#222] transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <span className="text-[#888888] text-sm font-medium">
                        Page {page} of {songsPagination.totalPages}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={page === songsPagination.totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#171717] text-[#ededed] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#222] transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArtistSongsPage;
