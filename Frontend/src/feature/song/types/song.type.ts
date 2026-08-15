export interface Artist {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Album {
    id: string;
    title: string;
    imageUrl: string;
    releaseYear: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface Song {
    id: string;
    title: string;
    artists: Artist[];
    album: Album | null;
    duration: number;
    imageUrl: string;
    audioUrl: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    isLiked: boolean;
}