import { useEffect } from "react";
import { usePlaylist } from "../hook/usePlaylist";
import { PlaylistCard } from "../components/PlaylistCard";
import { Plus } from "lucide-react";
import { Loader } from "../../../components/shared/Loader";
import { Link } from "react-router-dom";

const MyPlaylistsPage = () => {
    const { userPlaylists, loading, error, getUserPlaylists } = usePlaylist();

    useEffect(() => {
        getUserPlaylists();
    }, []);

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#ededed] tracking-tight mb-2">
                        My Playlists
                    </h1>
                    <p className="text-[#888888] text-sm">
                        Your personal collection of playlists
                    </p>
                </div>
                <Link 
                    to="/create-playlist"
                    className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors w-fit"
                >
                    <Plus size={18} />
                    New Playlist
                </Link>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader size="lg" text="Loading playlists..." />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-[#ededed] font-medium mb-2">Failed to load playlists</p>
                    <p className="text-[#666666] text-sm">{error}</p>
                </div>
            ) : userPlaylists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-[#888888] text-sm">You haven't created any playlists yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 gap-y-10">
                    {userPlaylists.map((playlist) => (
                        <div key={playlist.id} className="flex justify-center">
                            <PlaylistCard playlist={playlist} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPlaylistsPage;
