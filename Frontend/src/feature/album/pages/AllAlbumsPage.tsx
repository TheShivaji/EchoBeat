import { useEffect } from "react";
import { useAlbum } from "../hook/useAlbum";
import { AlbumCard } from "../../home/components/AlbumCard";
import { Loader2 } from "lucide-react";

const AllAlbumsPage = () => {
    const { allAlbums, loading, error, getAllAlbums } = useAlbum();

    useEffect(() => {
        getAllAlbums();
    }, []);

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-[#ededed] tracking-tight mb-2">
                    All Albums
                </h1>
                <p className="text-[#888888] text-sm">
                    Discover and listen to your favorite albums
                </p>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#666666] animate-spin" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-[#ededed] font-medium mb-2">Failed to load albums</p>
                    <p className="text-[#666666] text-sm">{error}</p>
                </div>
            ) : allAlbums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-[#888888] text-sm">No albums found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 gap-y-10">
                    {allAlbums.map((album) => (
                        <div key={album.id} className="flex justify-center">
                            <AlbumCard album={album} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllAlbumsPage;
