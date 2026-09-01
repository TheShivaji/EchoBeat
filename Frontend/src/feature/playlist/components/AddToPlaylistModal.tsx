import { useEffect } from "react";
import { X, Music, Plus } from "lucide-react";
import { usePlaylist } from "../hook/usePlaylist";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface AddToPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    songId: string;
}

const AddToPlaylistModal = ({ isOpen, onClose, songId }: AddToPlaylistModalProps) => {
    const { userPlaylists, getUserPlaylists, songActionInPlaylist, loading } = usePlaylist();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            getUserPlaylists();
        }
    }, [isOpen, getUserPlaylists]);

    if (!isOpen) return null;

    const handleAddToPlaylist = async (playlistId: string) => {
        if (loading) return;
        try {
            await songActionInPlaylist(playlistId, songId, "add");
            toast.success("Song added to playlist");
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to add song");
            // Do not close modal on error so they can see it or try another
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#121212] border border-[#222222] rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#222222]">
                    <h2 className="text-[15px] font-semibold text-white tracking-wide">
                        Add to Playlist
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#666666] hover:text-white transition-colors p-1"
                        aria-label="Close modal"
                    >
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {loading && userPlaylists.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <div className="w-5 h-5 border-2 border-[#444444] border-t-white rounded-full animate-spin"></div>
                        </div>
                    ) : userPlaylists.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center">
                            <Music size={32} className="text-[#333333] mb-3" />
                            <p className="text-[13px] text-[#888888] mb-4">
                                You don't have any playlists yet.
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate("/create-playlist"); // Assuming this is the route for creating a playlist
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <Plus size={16} />
                                Create Playlist
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {userPlaylists.map((playlist) => (
                                <button
                                    key={playlist.id}
                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                    disabled={loading}
                                    className="flex items-center gap-3 p-2.5 rounded-md hover:bg-[#1a1a1a] transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="w-10 h-10 rounded bg-[#222222] flex-shrink-0 overflow-hidden">
                                        {playlist.imageUrl ? (
                                            <img
                                                src={playlist.imageUrl}
                                                alt={playlist.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Music size={16} className="text-[#555555]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-[#e0e0e0] truncate group-hover:text-white transition-colors">
                                            {playlist.name}
                                        </p>
                                        {playlist.description && (
                                            <p className="text-[11px] text-[#777777] truncate">
                                                {playlist.description}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
