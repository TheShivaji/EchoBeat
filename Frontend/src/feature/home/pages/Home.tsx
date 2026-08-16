import { useEffect, useRef, useState, MouseEvent } from "react";
import { useHome } from "../hook/useHome";
import { useAlbum } from "../../album/hook/useAlbum";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HomeSkeleton from "../components/HomeSkeleton";
import HomeError from "../components/HomeError";
import SectionHeader from "../components/SectionHeader";
import ArtistCard from "../components/ArtistCard";
import SongCard from "../components/SongCard";
import NewReleaseCard from "../components/NewReleaseCard";
import { AlbumCard } from "../components/AlbumCard";
import { getGreeting } from "../utils/home.utils";

import type { PlayHistoryItem, Song } from "../types/home.types";

// ─── Section Entrance Wrapper ────────────────────────────────────────────────

const SectionWrapper = ({ children, id }: { children: React.ReactNode, id: string }) => (
    <motion.section 
        aria-labelledby={id}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-14"
    >
        {children}
    </motion.section>
);

// ─── Horizontal scroll row (Spotify Style) ───────────────────────────────────

const HScrollRow = ({ children }: { children: React.ReactNode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startScrollLeft, setStartScrollLeft] = useState(0);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeft(scrollLeft > 0);
        setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener("resize", handleScroll);

        const el = scrollRef.current;
        if (!el) {
            return () => window.removeEventListener("resize", handleScroll);
        }

        const onWheel = (e: WheelEvent) => {
            const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            const delta = isHorizontalScroll ? e.deltaX : e.deltaY;

            if (delta === 0) return;

            const { scrollLeft, scrollWidth, clientWidth } = el;
            
            if (delta < 0 && scrollLeft <= 0) return;
            if (delta > 0 && Math.ceil(scrollLeft + clientWidth) >= scrollWidth) return;

            e.preventDefault();
            el.scrollLeft += delta * 1.5;
        };

        el.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            window.removeEventListener("resize", handleScroll);
            el.removeEventListener("wheel", onWheel);
        };
    }, [children]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === "left" ? -clientWidth / 1.5 : clientWidth / 1.5;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    // Mouse drag handlers for desktop swipe simulation
    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setStartScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => setIsDragging(false);
    const onMouseUp = () => setIsDragging(false);
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = startScrollLeft - walk;
    };

    return (
        <div className="relative group -mx-1 px-1">
            <AnimatePresence>
                {showLeft && (
                    <motion.button 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => scroll("left")}
                        className="absolute left-2 top-[40%] -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-9 h-9 bg-[#171717] border border-[#222222] rounded-full text-[#ededed] hover:bg-[#282828] transition-colors shadow-lg cursor-pointer"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
            
            {/* Scroll Container */}
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                className={`flex w-full overflow-x-auto overflow-y-hidden gap-3 md:gap-5 pb-4 scrollbar-hidden ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`} 
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {children}
            </div>

            <AnimatePresence>
                {showRight && (
                    <motion.button 
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => scroll("right")}
                        className="absolute right-2 top-[40%] -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-9 h-9 bg-[#171717] border border-[#222222] rounded-full text-[#ededed] hover:bg-[#282828] transition-colors shadow-lg cursor-pointer"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Home Page ────────────────────────────────────────────────────────────────

const Home = () => {
    // Using real API data
    const { homeData, loading, error, refetch } = useHome();
    const { allAlbums, getAllAlbums, loading: albumLoading } = useAlbum();

    useEffect(() => {
        getAllAlbums();
    }, []);

    if (loading || albumLoading) return <HomeSkeleton />;
    if (error) return <HomeError onRetry={refetch} />;
    if (!homeData) return null;

    const { popularArtists, popularSongs, newReleases, recentlyPlayed } = homeData;

    const hasArtists = popularArtists.length > 0;
    const hasSongs = popularSongs.length > 0;
    const hasNewReleases = newReleases.length > 0;
    const hasRecentlyPlayed = (recentlyPlayed?.length ?? 0) > 0;
    const hasAlbums = (allAlbums?.length ?? 0) > 0;

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-4 md:px-10 lg:px-12 py-8 md:py-10 pb-28 md:pb-10 overflow-x-hidden">

            {/* ── Page header ──────────────────────────────────────────────── */}
            <header className="mb-10 md:mb-14">
                <p className="text-[11px] font-semibold text-[#555555] tracking-[0.14em] uppercase mb-2">
                    {getGreeting()}
                </p>
                <h1
                    className="text-[28px] md:text-[40px] font-normal text-[#ededed] leading-tight tracking-[-0.02em]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                    What do you want to hear?
                </h1>
            </header>

            {/* ── Popular Artists ───────────────────────────────────────────── */}
            {hasArtists && (
                <SectionWrapper id="popular-artists-heading">
                    <SectionHeader
                        title="Popular Artists"
                        action={<Link to="/artists">See all</Link>}
                    />
                    <HScrollRow>
                        {popularArtists.map((artist) => (
                            <ArtistCard key={artist.id} artist={artist} />
                        ))}
                    </HScrollRow>
                </SectionWrapper>
            )}

            {/* ── Trending Songs ────────────────────────────────────────────── */}
            {hasSongs && (
                <SectionWrapper id="trending-heading">
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
                </SectionWrapper>
            )}

            {/* ── New Releases ──────────────────────────────────────────────── */}
            {hasNewReleases && (
                <SectionWrapper id="new-releases-heading">
                    <SectionHeader title="New Releases" action={<Link to="/new-releases">See all</Link>} />
                    <HScrollRow>
                        {newReleases.map((song) => (
                            <NewReleaseCard key={song.id} song={song} />
                        ))}
                    </HScrollRow>
                </SectionWrapper>
            )}

            {/* ── Featured Albums ───────────────────────────────────────────── */}
            {hasAlbums && (
                <SectionWrapper id="featured-albums-heading">
                    <SectionHeader
                        title="Featured Albums"
                        action={<Link to="/albums">See all</Link>}
                    />
                    <HScrollRow>
                        {allAlbums.slice(0, 6).map((album) => (
                            <AlbumCard key={album.id} album={album} />
                        ))}
                    </HScrollRow>
                </SectionWrapper>
            )}

            {/* ── Recently Played ───────────────────────────────────────────── */}
            {hasRecentlyPlayed && (
                <SectionWrapper id="recently-played-heading">
                    <SectionHeader title="Recently Played" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0.5">
                        {(recentlyPlayed as PlayHistoryItem[]).slice(0, 10).map((item) => (
                            <SongCard
                                key={item.id}
                                song={item.song as Song}
                            />
                        ))}
                    </div>
                </SectionWrapper>
            )}

            {/* ── All sections empty ────────────────────────────────────────── */}
            {!hasArtists && !hasSongs && !hasNewReleases && !hasRecentlyPlayed && !hasAlbums && (
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
