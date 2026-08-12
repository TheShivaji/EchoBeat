// ─── HomeSkeleton ─────────────────────────────────────────────────────────────
// Premium skeleton loading state — matches the dark design system

const SkeletonBlock = ({ className }: { className?: string }) => (
    <div
        className={`bg-[#181818] rounded-md animate-pulse ${className ?? ""}`}
        aria-hidden="true"
    />
);

const ArtistSkeleton = () => (
    <div className="flex-shrink-0 w-[140px]">
        <SkeletonBlock className="w-full aspect-square rounded-full mb-3" />
        <SkeletonBlock className="h-3 w-3/4 mx-auto" />
        <SkeletonBlock className="h-2.5 w-1/2 mx-auto mt-1.5" />
    </div>
);

const SongRowSkeleton = () => (
    <div className="flex items-center gap-4 px-3 py-2.5">
        <SkeletonBlock className="w-10 h-10 rounded-sm flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3 w-3/5" />
            <SkeletonBlock className="h-2.5 w-2/5" />
        </div>
    </div>
);

const CardSkeleton = () => (
    <div className="flex-shrink-0 w-[160px]">
        <SkeletonBlock className="w-full aspect-square rounded-md mb-3" />
        <SkeletonBlock className="h-3 w-4/5 mb-1.5" />
        <SkeletonBlock className="h-2.5 w-3/5" />
    </div>
);

const SectionSkeleton = ({ children }: { children: React.ReactNode }) => (
    <section className="mb-14">
        <SkeletonBlock className="h-5 w-36 mb-6" />
        {children}
    </section>
);

const HomeSkeleton = () => (
    <div className="px-8 md:px-12 py-10" aria-label="Loading home content" aria-busy="true">
        {/* Header */}
        <div className="mb-14">
            <SkeletonBlock className="h-3 w-24 mb-3" />
            <SkeletonBlock className="h-9 w-56" />
        </div>

        {/* Popular Artists */}
        <SectionSkeleton>
            <div className="flex gap-5 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => <ArtistSkeleton key={i} />)}
            </div>
        </SectionSkeleton>

        {/* Trending Songs */}
        <SectionSkeleton>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {Array.from({ length: 6 }).map((_, i) => <SongRowSkeleton key={i} />)}
            </div>
        </SectionSkeleton>

        {/* New Releases */}
        <SectionSkeleton>
            <div className="flex gap-5 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
        </SectionSkeleton>
    </div>
);

export default HomeSkeleton;
