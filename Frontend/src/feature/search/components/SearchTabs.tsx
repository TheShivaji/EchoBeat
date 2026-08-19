import React from "react";
import type { SearchTabsProps, SearchTabType } from "../types/search.types";

export const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: { id: SearchTabType; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'songs', label: 'Songs' },
        { id: 'artists', label: 'Artists' },
        { id: 'albums', label: 'Albums' },
        { id: 'playlists', label: 'Playlists' },
    ];

    return (
        <div className="w-full overflow-x-auto scrollbar-hidden pb-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-max px-1">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium
                                transition-all duration-200 select-none whitespace-nowrap
                                ${isActive 
                                    ? "bg-white text-black hover:bg-[#e0e0e0]" 
                                    : "bg-[#282828] text-[#ededed] hover:bg-[#333333] hover:text-white"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
