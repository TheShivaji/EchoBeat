const ArtistDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-14 animate-pulse">
                {/* Artwork Skeleton */}
                <div className="w-full md:w-[300px] lg:w-[380px] aspect-square bg-[#171717] rounded-lg flex-shrink-0 border border-[#222222]" />
                
                {/* Info Skeleton */}
                <div className="flex flex-col justify-end w-full pb-2 md:pb-6">
                    <div className="h-3 w-16 bg-[#171717] rounded mb-4" /> {/* Eyebrow */}
                    <div className="h-12 md:h-16 lg:h-20 w-2/3 bg-[#171717] rounded mb-6" /> {/* Name */}
                    
                    {/* Bio skeleton lines */}
                    <div className="space-y-3 mb-8">
                        <div className="h-4 w-full max-w-xl bg-[#171717] rounded" />
                        <div className="h-4 w-5/6 max-w-xl bg-[#171717] rounded" />
                        <div className="h-4 w-4/6 max-w-xl bg-[#171717] rounded" />
                    </div>
                    
                    {/* Stats Skeleton */}
                    <div className="flex items-center gap-8 mt-auto">
                        <div className="h-8 w-20 bg-[#171717] rounded" />
                        <div className="h-8 w-20 bg-[#171717] rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistDetailsSkeleton;
