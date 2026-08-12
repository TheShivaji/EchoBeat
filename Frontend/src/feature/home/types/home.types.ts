export interface Artist {
    id: string;
    name: string;
    imageUrl?: string | null;
    playCount?: number;
    isDeleted?: boolean;
}

export interface Song {
    id: string;
    title: string;
    imageUrl?: string | null;
    duration?: number;
    releasedDate?: string;
    playCount?: number;
    artists: Artist[];
    album?: Album | null;
    isDeleted?: boolean;
}

export interface Album {
    id: string;
    title: string;
    imageUrl?: string | null;
}

export interface PlayHistoryItem {
    id: string;
    playedAt: string;
    song: Song;
}

export interface HomeData {
    popularArtists: Artist[];
    popularSongs: Song[];
    newReleases: Song[];
    recentlyPlayed?: PlayHistoryItem[];
}
