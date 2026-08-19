import React, { useState } from "react";
import { SearchInput } from "../components/SearchInput";
import { SearchTabs } from "../components/SearchTabs";
import { SearchResults } from "../components/SearchResults";
import {
    SearchInitialState,
    SearchLoadingState,
    SearchEmptyState,
    SearchErrorState
} from "../components/SearchStates";
import type { SearchTabType } from "../types/search.types";
import type { Song } from "../../song/types/song.type";
import type { Artist } from "../../artists/types/artists.types";
import type { Album } from "../../album/types/album.types";
import type { Playlist } from "../../playlist/types/playlist.types";
import { useSearch } from "../hook/useSearch";

interface SearchPageProps {
    // These props are meant for the parent to control the data.
    // For now, they are optional and we use local dummy state if not provided.
    // The business logic will eventually control these entirely.
    initialQuery?: string;
    loading?: boolean;
    error?: boolean;
    songs?: Song[];
    artists?: Artist[];
    albums?: Album[];
    playlists?: Playlist[];
}

const SearchPage: React.FC<SearchPageProps> = ({
    initialQuery = "",
    loading = false,
    error = false,
    songs = [],
    artists = [],
    albums = [],
    playlists = []
}) => {

    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<SearchTabType>('all');

    const {
        artists: searchArtists,
        albums: searchAlbums,
        playlists: searchPlaylists,
        songs: searchSongs,
        loading: searchLoading,
        error: searchError,
        handleSearchArtist,
        handleSearchAlbum,
        handleSearchSong,
        handleSearchPlaylist,
        controllerRef
    } = useSearch();

    const currentArtists = searchArtists.length > 0 ? searchArtists : artists;
    const currentAlbums = searchAlbums.length > 0 ? searchAlbums : albums;
    const currentPlaylists = searchPlaylists.length > 0 ? searchPlaylists : playlists;
    const currentSongs = searchSongs.length > 0 ? searchSongs : songs;

    const isLoading = loading || searchLoading.artists || searchLoading.albums || searchLoading.songs || searchLoading.playlists;
    const hasError = error || !!searchError;

    const isInitial = query.trim().length === 0 && !isLoading && !hasError;
    const hasResults = currentSongs.length > 0 || currentArtists.length > 0 || currentAlbums.length > 0 || currentPlaylists.length > 0;
    const isEmpty = !isInitial && !isLoading && !hasError && !hasResults;

    const controller = new AbortController();

    controllerRef.current = controller;

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (activeTab === "all") {
            handleSearchArtist(query);
            handleSearchAlbum(query);
            handleSearchSong(query);
            handleSearchPlaylist(query);
        } else if (activeTab === "artists") {
            handleSearchArtist(query);
        } else if (activeTab === "albums") {
            handleSearchAlbum(query);
        } else if (activeTab === "songs") {
            handleSearchSong(query);
        } else if (activeTab === "playlists") {
            handleSearchPlaylist(query);
        }

        console.log(activeTab);
        console.log(`Search Query is : ${query}`);
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] px-4 md:px-10 lg:px-12 py-8 md:py-10 pb-28 md:pb-10 flex flex-col">

            {/* Header / Input Area */}
            <header className="mb-6 w-full flex flex-col gap-6">
                <h1
                    className="text-[28px] md:text-[40px] font-normal text-[#ededed] leading-tight tracking-[-0.02em]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                >
                    Search
                </h1>

                <SearchInput
                    value={query}
                    onChange={setQuery}
                    onSubmit={handleSearchSubmit}
                    autoFocus
                />
            </header>

            {/* Tabs Area */}
            {!isInitial && !error && (
                <div className="mb-6">
                    <SearchTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col">
                {isInitial && <SearchInitialState />}

                {isLoading && <SearchLoadingState />}

                {hasError && !isLoading && <SearchErrorState />}

                {isEmpty && !isInitial && !isLoading && !hasError && (
                    <SearchEmptyState query={query} />
                )}

                {hasResults && !isLoading && !hasError && (
                    <SearchResults
                        activeTab={activeTab}
                        songs={currentSongs}
                        artists={currentArtists}
                        albums={currentAlbums}
                        playlists={currentPlaylists}
                    />
                )}
            </main>
        </div>
    );
};

export default SearchPage;
