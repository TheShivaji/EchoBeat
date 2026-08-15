import { Play } from "lucide-react";

const SongDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#0c0c0c] px-6 md:px-10 lg:px-12 py-10 md:py-16">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-14 animate-pulse">
                {/* Artwork Skeleton */}
                <div className="w-full md:w-[300px] lg:w-[380px] aspect-square bg-[#171717] rounded-lg flex-shrink-0 border border-[#222222]" />
                
                {/* Info Skeleton */}
                <div className="flex flex-col justify-end w-full pb-2 md:pb-6">
                    <div className="h-3 w-12 bg-[#171717] rounded mb-4" /> {/* Eyebrow */}
                    <div className="h-12 md:h-16 lg:h-20 w-3/4 bg-[#171717] rounded mb-5" /> {/* Title */}
                    <div className="h-6 w-1/2 bg-[#171717] rounded mb-5" /> {/* Artists */}
                    <div className="h-4 w-1/3 bg-[#171717] rounded mb-8 mt-1" /> {/* Metadata */}
                    
                    {/* Actions Skeleton */}
                    <div className="flex items-center gap-6 mt-auto">
                        <div className="w-14 h-14 bg-[#171717] rounded-full" />
                        <div className="w-8 h-8 bg-[#171717] rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongDetailsSkeleton;
