import type { Song } from "../../song/types/song.type";
import type { Artist } from "../../artists/types/artists.types";
import type { Album } from "../../album/types/album.types";
import type { Playlist } from "../../playlist/types/playlist.types";

export type SearchTabType = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e?: React.FormEvent) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export interface SearchTabsProps {
    activeTab: SearchTabType;
    onTabChange: (tab: SearchTabType) => void;
}

export interface SearchResultsProps {
    activeTab: SearchTabType;
    songs: Song[];
    artists: Artist[];
    albums: Album[];
    playlists: Playlist[];
}

export interface SearchStatesProps {
    query: string;
}

export interface Search{
    q:string
    limit:number
    page:number
}
