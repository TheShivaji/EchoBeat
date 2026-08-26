import React from "react";
import type { SearchTabsProps, SearchTabType } from "../types/search.types";

export const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: { id: SearchTabType; label: string }[] = [
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
                                px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[14px] md:text-[15px] font-medium
                                transition-all duration-300 ease-out select-none whitespace-nowrap
                                ${isActive 
                                    ? "bg-white text-black shadow-sm" 
                                    : "bg-[#181818] text-[#888] hover:bg-[#222] hover:text-[#ededed]"
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
