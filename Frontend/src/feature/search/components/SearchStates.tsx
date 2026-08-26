import React from "react";
import { Search, AlertCircle, Music } from "lucide-react";
import type { SearchStatesProps } from "../types/search.types";

const SkeletonBlock = ({ className }: { className?: string }) => (
    <div
        className={`bg-[#181818] rounded-md animate-pulse ${className ?? ""}`}
        aria-hidden="true"
    />
);

export const SearchLoadingState: React.FC = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full pt-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-full">
                    <SkeletonBlock className="w-full aspect-square rounded-md mb-3" />
                    <SkeletonBlock className="h-3 w-4/5 mb-1.5" />
                    <SkeletonBlock className="h-2.5 w-3/5" />
                </div>
            ))}
        </div>
    );
};

export const SearchEmptyState: React.FC<SearchStatesProps & { activeTab: string }> = ({ query, activeTab }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-24 text-center px-4">
            <h3 className="text-[20px] font-semibold text-white mb-2 tracking-tight">
                No {activeTab} found for "{query}"
            </h3>
            <p className="text-[14px] font-medium text-[#888] max-w-[400px]">
                Please make sure your words are spelled correctly, or use less or different keywords.
            </p>
        </div>
    );
};

export const SearchErrorState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-24 text-center px-4">
            <h3 className="text-[20px] font-semibold text-white mb-2 tracking-tight">
                Something went wrong
            </h3>
            <p className="text-[14px] font-medium text-[#888] max-w-[400px]">
                We encountered an error while searching. Please try again later.
            </p>
        </div>
    );
};

export const SearchInitialState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-24 text-center px-4">
            <h3 className="text-[20px] font-semibold text-white mb-2 tracking-tight">
                Search for songs, artists, albums, or playlists.
            </h3>
            <p className="text-[14px] font-medium text-[#888] max-w-[400px]">
                Find your favorite music and explore new sounds.
            </p>
        </div>
    );
};
