import React from "react";
import type { SearchResultsProps } from "../types/search.types";
import SongCard from "../../home/components/SongCard";
import ArtistCard from "../../home/components/ArtistCard";
import { AlbumCard } from "../../home/components/AlbumCard";
import { PlaylistCard } from "../../playlist/components/PlaylistCard";

export const SearchResults: React.FC<SearchResultsProps> = ({
    activeTab,
    songs,
    artists,
    albums,
    playlists
}) => {
    
    // Grid Layouts
    const GridContainer = ({ children, title }: { children: React.ReactNode, title?: string }) => (
        <div className="mb-10 w-full">
            {title && (
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {children}
            </div>
        </div>
    );

    const renderSongs = () => {
        if (songs.length === 0) return null;
        return (
            <GridContainer>
                {songs.map(song => (
                    <SongCard key={song.id} song={song} />
                ))}
            </GridContainer>
        );
    };

    const renderArtists = () => {
        if (artists.length === 0) return null;
        return (
            <GridContainer>
                {artists.map(artist => (
                    <ArtistCard key={artist.id} artist={artist} />
                ))}
            </GridContainer>
        );
    };

    const renderAlbums = () => {
        if (albums.length === 0) return null;
        return (
            <GridContainer>
                {albums.map(album => (
                    <AlbumCard key={album.id} album={album} />
                ))}
            </GridContainer>
        );
    };

    const renderPlaylists = () => {
        if (playlists.length === 0) return null;
        return (
            <GridContainer>
                {playlists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
            </GridContainer>
        );
    };

    const isEmpty = songs.length === 0 && artists.length === 0 && albums.length === 0 && playlists.length === 0;

    if (isEmpty) {
        // The parent usually handles EmptyState by checking lengths or passing a specific state,
        // but as a fallback, if this component is rendered with all empty arrays, we can show nothing or an empty state.
        return null; // Let the parent render SearchEmptyState for better control over the 'query' string.
    }

    return (
        <div className="w-full flex flex-col pt-4">
            {activeTab === 'songs' && renderSongs()}
            {activeTab === 'artists' && renderArtists()}
            {activeTab === 'albums' && renderAlbums()}
            {activeTab === 'playlists' && renderPlaylists()}
        </div>
    );
};
