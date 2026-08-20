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
        <div className="flex flex-col items-center justify-center w-full py-20 text-center px-4">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-[#888888]" />
            </div>
            <h3 className="text-xl font-medium text-[#ededed] mb-2">
                No {activeTab} found
            </h3>
            <p className="text-sm text-[#888888] max-w-[400px]">
                Try a different search.
            </p>
        </div>
    );
};

export const SearchErrorState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-20 text-center px-4">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-[#ef4444]" />
            </div>
            <h3 className="text-xl font-medium text-[#ededed] mb-2">
                Something went wrong
            </h3>
            <p className="text-sm text-[#888888] max-w-[400px]">
                We encountered an error while searching. Please try again later.
            </p>
        </div>
    );
};

export const SearchInitialState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-20 text-center px-4">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
                <Music className="w-8 h-8 text-[#888888]" />
            </div>
            <h3 className="text-xl font-medium text-[#ededed] mb-2">
                What do you want to listen to?
            </h3>
            <p className="text-sm text-[#888888] max-w-[400px]">
                Search for artists, songs, albums, or playlists.
            </p>
        </div>
    );
};
