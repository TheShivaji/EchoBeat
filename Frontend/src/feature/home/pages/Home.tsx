import { useHome } from "../hook/useHome";
import { Link } from "react-router-dom";
import HomeSkeleton from "../components/HomeSkeleton";
import HomeError from "../components/HomeError";
import SectionHeader from "../components/SectionHeader";
import ArtistCard from "../components/ArtistCard";
import SongCard from "../components/SongCard";
import NewReleaseCard from "../components/NewReleaseCard";
import { getGreeting } from "../utils/home.utils";

import type { PlayHistoryItem, Song } from "../types/home.types";

// ─── Horizontal scroll row ────────────────────────────────────────────────────

const HScrollRow = ({ children }: { children: React.ReactNode }) => (
    <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hidden -mx-1 px-1">
        {children}
    </div>
);

// ─── Home Page ────────────────────────────────────────────────────────────────

const Home = () => {
    // Using real API data
    const { homeData, loading, error, refetch } = useHome();
    if (loading) return <HomeSkeleton />;
    if (error) return <HomeError onRetry={refetch} />;
    if (!homeData) return null;

    const { popularArtists, popularSongs, newReleases, recentlyPlayed } = homeData;

    const hasArtists = popularArtists.length > 0;
    const hasSongs = popularSongs.length > 0;
    const hasNewReleases = newReleases.length > 0;
    const hasRecentlyPlayed = (recentlyPlayed?.length ?? 0) > 0;

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10">

            {/* ── Page header ──────────────────────────────────────────────── */}
            <header className="mb-14">
                <p className="text-[11px] font-semibold text-[#555555] tracking-[0.14em] uppercase mb-2">
                    {getGreeting()}
                </p>
                <h1
                    className="text-[36px] md:text-[40px] font-normal text-[#ededed] leading-tight tracking-[-0.02em]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                    What do you want to hear?
                </h1>
            </header>

            {/* ── Popular Artists ───────────────────────────────────────────── */}
            {hasArtists && (
                <section className="mb-14" aria-labelledby="popular-artists-heading">
                    <SectionHeader
                        title="Popular Artists"
                        action={<Link to="/artists">See all</Link>}
                    />
                    <HScrollRow>
                        {popularArtists.map((artist) => (
                            <ArtistCard key={artist.id} artist={artist} />
                        ))}
                    </HScrollRow>
                </section>
            )}

            {/* ── Trending Songs ────────────────────────────────────────────── */}
            {hasSongs && (
                <section className="mb-14" aria-labelledby="trending-heading">
                    <SectionHeader title="Trending Songs" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0.5">
                        {popularSongs.map((song, index) => (
                            <SongCard
                                key={song.id}
                                song={song}
                                index={index}
                                showIndex
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── New Releases ──────────────────────────────────────────────── */}
            {hasNewReleases && (
                <section className="mb-14" aria-labelledby="new-releases-heading">
                    <SectionHeader title="New Releases" action="See all" />
                    <HScrollRow>
                        {newReleases.map((song) => (
                            <NewReleaseCard key={song.id} song={song} />
                        ))}
                    </HScrollRow>
                </section>
            )}

            {/* ── Recently Played ───────────────────────────────────────────── */}
            {hasRecentlyPlayed && (
                <section className="mb-14" aria-labelledby="recently-played-heading">
                    <SectionHeader title="Recently Played" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0.5">
                        {(recentlyPlayed as PlayHistoryItem[]).slice(0, 10).map((item) => (
                            <SongCard
                                key={item.id}
                                song={item.song as Song}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── All sections empty ────────────────────────────────────────── */}
            {!hasArtists && !hasSongs && !hasNewReleases && !hasRecentlyPlayed && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-[14px] text-[#666666] font-normal max-w-[300px] leading-relaxed">
                        No content available yet. Start listening to build your music library.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
