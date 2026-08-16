import { useEffect } from "react";
import { useNewReleases } from "../hook/useNewReleases";
import SongCard from "../../home/components/SongCard";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import HomeError from "../../home/components/HomeError";

const NewReleasesPage = () => {
    const { songs, loading, error, hasMore, loadMore, getNewReleases } = useNewReleases();

    useEffect(() => {
        getNewReleases(1);
    }, [getNewReleases]);

    if (error) {
        return <HomeError onRetry={() => getNewReleases(1)} />;
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-4 md:px-10 lg:px-12 py-8 md:py-10 pb-28 md:pb-10">
            <header className="mb-10 md:mb-14">
                <h1 
                    className="text-[28px] md:text-[40px] font-normal text-[#ededed] leading-tight tracking-[-0.02em]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                    New Releases
                </h1>
                <p className="text-[#888888] mt-2 text-sm md:text-base">
                    The latest tracks out right now.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
                {songs.map((song, index) => (
                    <motion.div
                        key={`${song.id}-${index}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: (index % 20) * 0.03 }}
                    >
                        <SongCard song={song} />
                    </motion.div>
                ))}
            </div>

            {loading && songs.length === 0 && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-[#888] w-8 h-8" />
                </div>
            )}

            {!loading && songs.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-[#888888]">No new releases available right now.</p>
                </div>
            )}

            {hasMore && songs.length > 0 && (
                <div className="flex justify-center mt-12 mb-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 rounded-full border border-[#333333] hover:border-[#666666] text-[#ededed] hover:bg-[#1a1a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More Releases"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewReleasesPage;
