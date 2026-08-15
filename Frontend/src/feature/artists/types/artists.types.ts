export interface UploadArtists {
    name: string;
    bio: string;
    imageFile: File;
}

export interface Artist {
    id: string;
    name: string;
    imageUrl?: string | null;
    bio?: string;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        songs: number;
        albums: number;
    }
}
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ArtistSongsResponse {
    message: string;
    songs: any[]; // We will import Song type later if needed, or use any[] for flexibility in the hook for now
    pagination: Pagination;
}

export interface ArtistAlbumsResponse {
    message: string;
    albums: any[]; // We will import Album type
    pagination: Pagination;
}
